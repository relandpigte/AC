using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Extensions;
using Academically.Services.Profiles.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SourceCloud.Core.Services;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Profiles
{
    [AbpAuthorize(PermissionNames.Pages_Profile)]
    public class ProfilesAppService : AcademicallyAppServiceBase, IProfilesAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<UserEducationLevel, Guid> _userEducationLevelsRepository;
        private readonly IRepository<StudentRating, Guid> _studentRatingsRepository;
        private readonly IRepository<TutorRating, Guid> _tutorRatingsRepository;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public ProfilesAppService(
            UserManager userManager,
            IRepository<User, long> usersRepository,
            IRepository<UserEducationLevel, Guid> userEducationLevelsRepository,
            IRepository<StudentRating, Guid> studentRatingsRepository,
            IRepository<TutorRating, Guid> tutorRatingsRepository,
            ISettingManager settingManager,
            IFileManagerService fileManagerService
            )
        {
            _userManager = userManager;
            _usersRepository = usersRepository;
            _userEducationLevelsRepository = userEducationLevelsRepository;
            _studentRatingsRepository = studentRatingsRepository;
            _tutorRatingsRepository = tutorRatingsRepository;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
        }

        public async Task<UserDto> Get(long id)
        {
            var user = await _usersRepository.GetAllIncluding(e => e.Roles)
                .FirstOrDefaultAsync(e => e.Id == id);
            var output = ObjectMapper.Map<UserDto>(user);
            output.RoleNames = await _userManager.GetRolesAsync(user);

            if (!user.CoverPhotoFileName.IsNullOrWhiteSpace())
            {
                string coverPhotoFolder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos);
                output.CoverPhotoUrl = _fileManagerService.GetFileUrl(user.CoverPhotoFileName, user.Id, coverPhotoFolder);
            }

            return output;
        }

        public async Task<VerificationStatusDto> GetVerificationStatus(long id)
        {
            var user = await _usersRepository.GetAsync(id);
            var verificationStatus = new VerificationStatusDto()
            {
                IsEmailConfirmed = user.IsEmailConfirmed,
                IsPhoneNumberConfirmed = user.IsPhoneNumberConfirmed,
            };
            return verificationStatus;
        }

        public async Task<ProfileMetricDto> GetMetrics(long id)
        {
            // TODO: Replace static values with proper datta
            // once the schemas are defined for each metric
            var profileMetric = new ProfileMetricDto() {
                TotalHours = 521,
                TotalHoursChange = "+3.5%",
                UserType = "Researcher",
            };

            var user = await UserManager.GetUserByIdAsync(id);

            var highestAcademicLevel = await _userEducationLevelsRepository.GetAll()
                .Where(e => e.UserEducation.UserId == id)
                .OrderByDescending(e => e.EducationLevel.DisplayOrder)
                .Select(e => e.EducationLevel)
                .FirstOrDefaultAsync();
            if (highestAcademicLevel != null)
            {
                profileMetric.AcademicLevel = highestAcademicLevel.ShortName;
            }

            int totalPositiveReviews = 0;
            int totalNegativeReviews = 0;
            if (await UserManager.IsInRoleAsync(user, StaticRoleNames.Tenants.Tutor))
            {
                var tutorRatingsQuery = _tutorRatingsRepository.GetAll()
                    .Where(e => e.TutorId == id);
                profileMetric.TotalReviews = await tutorRatingsQuery.CountAsync();
                if (profileMetric.TotalReviews > 0)
                {
                    totalPositiveReviews = await _tutorRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive);
                    totalNegativeReviews = await _tutorRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative);
                }
            }
            else
            {
                var studentRatingsQuery = _studentRatingsRepository.GetAll()
                    .Where(e => e.StudentId == id);
                profileMetric.TotalReviews = await studentRatingsQuery.CountAsync();
                if (profileMetric.TotalReviews > 0)
                {
                    totalPositiveReviews = await _studentRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive);
                    totalNegativeReviews = await _studentRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative);
                }
            }
            if (totalPositiveReviews > 0 || totalNegativeReviews > 0)
            {
                profileMetric.PositiveReviewsPercentage = Math.Round(totalPositiveReviews.ToDecimal() 
                    / (totalPositiveReviews.ToDecimal() + totalNegativeReviews.ToDecimal()) * 100, 1);
            }

            return profileMetric;
        }

        public async Task UpdateWebsiteUrl(string websiteUrl)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.WebsiteUrl = websiteUrl;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task UpdateAbout(string about)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.About = about;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task<string> UpdateCoverPhoto([FromForm] UpdateCoverPhotoInput input)
        {
            long userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos);
            folder = $"{userId}/{folder}";
            string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(input.CoverPhoto.FileName)}";
            string oldFileName = "";

            using (var stream = input.CoverPhoto.OpenReadStream())
            {
                var fileBytes = stream.GetAllBytes();
                await _fileManagerService.UploadAsync(fileName, input.CoverPhoto.ContentType, fileBytes, folder);
                oldFileName = user.CoverPhotoFileName;
                user.CoverPhotoFileName = fileName;
            }

            await _usersRepository.UpdateAsync(user);

            if (!oldFileName.IsNullOrWhiteSpace())
            {
                await _fileManagerService.DeleteAsync(folder, oldFileName);
            }

            string coverPhotoFolder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos);
            return _fileManagerService.GetFileUrl(user.CoverPhotoFileName, user.Id, coverPhotoFolder);
        }

        public async Task DeleteCoverPhoto()
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos);
            folder = $"{user.Id}/{folder}";
            await _fileManagerService.DeleteAsync(folder, user.CoverPhotoFileName);
            user.CoverPhotoFileName = "";
            await _usersRepository.UpdateAsync(user);
        }
    }
}
