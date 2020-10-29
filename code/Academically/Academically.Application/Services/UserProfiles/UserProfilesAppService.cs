using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Application.Shared.Services;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.UserProfiles.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Academically.Services.UserProfiles
{
    [AbpAuthorize(PermissionNames.Pages_Account, PermissionNames.Pages_Profile)]
    public class UserProfilesAppService : AcademicallyAppServiceBase, IUserProfilesAppService
    {
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<UserDisciplineTaxonomy, Guid> _userDisciplineTaxonomiesRepository;
        private readonly IRepository<UserDisciplineTaxonomyStudyLevel, int> _userDisciplineTaxonomyStudyLevelsRepository;
        private readonly RoleManager _roleManager;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public UserProfilesAppService(
            IRepository<UserProfile, Guid> userProfilesRepository,
            IRepository<User, long> usersRepository,
            IRepository<UserDisciplineTaxonomy, Guid> userDisciplineTaxonomiesRepository,
            RoleManager roleManager,
            ISettingManager settingManager,
            IFileManagerService fileManagerService,
            IRepository<UserDisciplineTaxonomyStudyLevel, int> userDisciplineTaxonomyStudyLevelsRepository
            )
        {
            _userProfilesRepository = userProfilesRepository;
            _usersRepository = usersRepository;
            _userDisciplineTaxonomiesRepository = userDisciplineTaxonomiesRepository;
            _roleManager = roleManager;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
            _userDisciplineTaxonomyStudyLevelsRepository = userDisciplineTaxonomyStudyLevelsRepository;
        }

        [AbpAuthorize(PermissionNames.Pages_Account_Details)]
        public async Task<GetProfileDetailDto> GetDetail(long userId)
        {
            var user = await _usersRepository.GetAll()
                .Include(e => e.Roles)
                .FirstOrDefaultAsync(e => e.Id == userId);
            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == userId);
            var role = await _roleManager.GetRoleByIdAsync(user.Roles.FirstOrDefault().RoleId);

            var output = ObjectMapper.Map<GetProfileDetailDto>(userProfile);
            if (output == null)
            {
                output = new GetProfileDetailDto();
            }
            output.FirstName = user.Name;
            output.LastName = user.Surname;
            output.ProfilePictureUrl = _fileManagerService.GetFileUrl(userProfile?.ProfilePictureFileName, userId, AppSettingNames.Aws_S3_Folders_ProfilePictures);
            output.DateJoined = user.CreationTime;
            output.Role = role.DisplayName;

            return output;
        }

        [AbpAuthorize(PermissionNames.Pages_Account_Details)]
        public async Task SaveDetail([FromForm] SaveProfileDetailDto input)
        {
            var userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            user.Name = input.FirstName;
            user.Surname = input.LastName;

            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == userId);
            if (userProfile == null)
            {
                userProfile = new UserProfile();
            }

            string oldFileName = "";
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_ProfilePictures);
            folder = $"{userId}/{folder}";
            string thumbnailsFolder = $"{folder}/thumbs";

            ObjectMapper.Map(input, userProfile);
            userProfile.UserId = user.Id;

            if (input.ProfilePicture != null)
            {
                string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(input.ProfilePicture.FileName)}";

                using (var stream = input.ProfilePicture.OpenReadStream())
                {
                    var fileBytes = stream.GetAllBytes();
                    await _fileManagerService.UploadAsync(fileName, fileBytes, folder);
                    oldFileName = userProfile.ProfilePictureFileName;
                    userProfile.ProfilePictureFileName = fileName;

                    var thumbsFileBytes = MakeThumbnail(fileBytes, 100, 100);
                    await _fileManagerService.UploadAsync(fileName, thumbsFileBytes, thumbnailsFolder);
                }
            }

            await _userProfilesRepository.InsertOrUpdateAsync(userProfile);

            if (!oldFileName.IsNullOrWhiteSpace())
            {
                await _fileManagerService.DeleteAsync(folder, oldFileName);
                await _fileManagerService.DeleteAsync(thumbnailsFolder, oldFileName);
            }
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy, PermissionNames.Pages_Profile_AreasOfStudy_KnowledgeBase)]
        public async Task<IEnumerable<GetUserDisciplineTaxonomyDto>> GetDisciplineTaxonomies(long userId)
        {
            var userDisciplineTaxonomies = await _userDisciplineTaxonomiesRepository.GetAll()
                .Include(e => e.DisciplineTaxonomy)
                .Where(e => e.UserId == userId)
                .Select(e => ObjectMapper.Map<GetUserDisciplineTaxonomyDto>(e))
                .ToListAsync();

            return userDisciplineTaxonomies;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy_KnowledgeBase_Create)]
        public async Task CreateManyDisciplineTaxonomy(IEnumerable<Guid> disciplineTaxonomyIds)
        {
            foreach (var disciplineTaxonomyId in disciplineTaxonomyIds)
            {
                var userDisciplineTaxonomy = new UserDisciplineTaxonomy()
                {
                    UserId = AbpSession.UserId.Value,
                    DisciplineTaxonomyId = disciplineTaxonomyId,
                };
                await _userDisciplineTaxonomiesRepository.InsertAsync(userDisciplineTaxonomy);
            }
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy_KnowledgeBase_Delete)]
        public async Task DeleteDisciplineTaxonomy(Guid userDisciplineTaxonomyId)
        {
            await _userDisciplineTaxonomiesRepository.DeleteAsync(userDisciplineTaxonomyId);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy_KnowledgeBase_Create)]
        public async Task CreateManyDisciplineTaxonomyStudyLevel(Guid disciplineTaxonomyId, IEnumerable<int> studyLevelIds)
        {
            foreach(var levelId in studyLevelIds)
            {
                var userDisciplineStudyLevel = new UserDisciplineTaxonomyStudyLevel()
                {
                    UserId = AbpSession.UserId.Value,
                    DisciplineTaxonomyId = disciplineTaxonomyId,
                    LevelId = levelId
                };

                await _userDisciplineTaxonomyStudyLevelsRepository.InsertAsync(userDisciplineStudyLevel);
            }
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy_KnowledgeBase_Delete)]
        public async Task DeleteDisciplineTaxonomyStudyLevel(int id)
        {
            await _userDisciplineTaxonomyStudyLevelsRepository.DeleteAsync(id);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy, PermissionNames.Pages_Profile_AreasOfStudy_KnowledgeBase)]
        public async Task<IEnumerable<GetUserDisciplineTaxonomyStudyLevelDto>> GetDisciplineTaxonomyStudyLevels()
        {
            var userDisciplineTaxonomies = await _userDisciplineTaxonomyStudyLevelsRepository.GetAll()
                .Where(e => e.UserId == AbpSession.UserId.Value)
                .Select(e => ObjectMapper.Map<GetUserDisciplineTaxonomyStudyLevelDto>(e))
                .ToListAsync();

            return userDisciplineTaxonomies;
        }

        private byte[] MakeThumbnail(byte[] imageBytes, int thumbWidth, int thumbHeight)
        {
            using (MemoryStream ms = new MemoryStream())
            using (Image image = Image.Load(imageBytes))
            {
                var resizeOptions = new ResizeOptions
                {
                    Size = new SixLabors.ImageSharp.Size { Width = thumbWidth, Height = thumbHeight },
                    Mode = ResizeMode.Stretch
                };
                image.Mutate(x => x.Resize(resizeOptions));
                image.Save(ms, new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder());
                ms.Position = 0;
                return ms.ToArray();
            }
        }
    }
}
