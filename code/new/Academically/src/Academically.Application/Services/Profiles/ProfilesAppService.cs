using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Extensions;
using Academically.Services.Profiles.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
        private readonly IRepository<PassportVerification, Guid> _passportVerifications;
        private readonly IDocumentsDomainService _documentsDomainService;

        public ProfilesAppService(
            UserManager userManager,
            IRepository<User, long> usersRepository,
            IRepository<UserEducationLevel, Guid> userEducationLevelsRepository,
            IRepository<StudentRating, Guid> studentRatingsRepository,
            IRepository<TutorRating, Guid> tutorRatingsRepository,
            IRepository<PassportVerification, Guid> passportVerifications,
            IDocumentsDomainService documentsDomainService
            )
        {
            _userManager = userManager;
            _usersRepository = usersRepository;
            _userEducationLevelsRepository = userEducationLevelsRepository;
            _studentRatingsRepository = studentRatingsRepository;
            _tutorRatingsRepository = tutorRatingsRepository;
            _passportVerifications = passportVerifications;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<UserDto> Get(long id)
        {
            var user = await _usersRepository.GetAll()
                .Include(e => e.CoverPhotoDocument)
                .Include(e => e.ProfilePictureDocument)
                .Include(e => e.Roles)
                .Include(e => e.UserEducations)
                    .ThenInclude(e => e.University)
                .FirstOrDefaultAsync(e => e.Id == id);
            var output = ObjectMapper.Map<UserDto>(user);
            output.RoleNames = await _userManager.GetRolesAsync(user);

            if (user.CoverPhotoDocumentId.HasValue)
            {
                output.CoverPhotoUrl = await _documentsDomainService.GetFileUrlAsync(user.CoverPhotoDocument);
            }
            if (user.ProfilePictureDocumentId.HasValue)
            {
                output.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(user.ProfilePictureDocument);
            }
            if (user.UserEducations != null && user.UserEducations.Count > 0)
            {
                output.CurrentUniversity = user.UserEducations
                    .OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                   .FirstOrDefault()
                   .University.HeProvider;
            }

            return output;
        }

        public async Task<VerificationStatusDto> GetVerificationStatus(long id)
        {
            var user = await _usersRepository.GetAsync(id);
            var passportVerification = await _passportVerifications
                .GetAll()
                .OrderByDescending(e => e.CreationTime)
                .FirstOrDefaultAsync(e => e.CreatorUserId == AbpSession.UserId.Value);

            var verificationStatus = new VerificationStatusDto()
            {
                IsEmailConfirmed = user.IsEmailConfirmed,
                IsPhoneNumberConfirmed = user.IsPhoneNumberConfirmed,
                PassportVerificationStatus = passportVerification == null
                    ? PassportVerificationStatus.None
                    : passportVerification.Status,
            };

            return verificationStatus;
        }

        public async Task<ProfileMetricDto> GetMetrics(long id)
        {
            // TODO: Replace static values with proper datta
            // once the schemas are defined for each metric
            var profileMetric = new ProfileMetricDto()
            {
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

        public async Task<string> UpdateCoverPhoto([FromForm] UpdateCoverPhotoRequestDto input)
        {
            long userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            var previousCoverPhotoDocumentId = user.CoverPhotoDocumentId;
            var coverPhotoDocument = await _documentsDomainService.CreateAsync(user.Id, input.CoverPhoto, DocumentType.CoverPhoto);
            user.CoverPhotoDocumentId = coverPhotoDocument.Id;

            if (previousCoverPhotoDocumentId.HasValue)
            {
                await _documentsDomainService.DeleteAsync(previousCoverPhotoDocumentId.Value);
            }

            await _usersRepository.UpdateAsync(user);
            return await _documentsDomainService.GetFileUrlAsync(coverPhotoDocument);
        }

        public async Task<string> UpdateProfilePicture([FromForm] UpdateProfilePictureRequestDto input)
        {
            long userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            var previousProfilePictureDocumentId = user.ProfilePictureDocumentId;
            var profilePictureDocument = await _documentsDomainService.CreateAsync(user.Id, input.ProfilePicture, DocumentType.ProfilePicture);
            user.ProfilePictureDocumentId = profilePictureDocument.Id;

            if (previousProfilePictureDocumentId.HasValue)
            {
                await _documentsDomainService.DeleteAsync(previousProfilePictureDocumentId.Value);
            }

            await _usersRepository.UpdateAsync(user);
            return await _documentsDomainService.GetFileUrlAsync(profilePictureDocument);
        }

        public async Task DeleteCoverPhoto()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            if (user.CoverPhotoDocumentId.HasValue)
            {
                var previousCoverPhotoDocumentId = user.CoverPhotoDocumentId.Value;
                user.CoverPhotoDocumentId = null;
                await _usersRepository.UpdateAsync(user);
                await _documentsDomainService.DeleteAsync(previousCoverPhotoDocumentId);
            }
        }

        public async Task DeleteProfilePicture()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            if (user.ProfilePictureDocumentId.HasValue)
            {
                var previousProfilePictureDocumentId = user.ProfilePictureDocumentId.Value;
                user.ProfilePictureDocumentId = null;
                await _usersRepository.UpdateAsync(user);
                await _documentsDomainService.DeleteAsync(previousProfilePictureDocumentId);
            }
        }
    }
}
