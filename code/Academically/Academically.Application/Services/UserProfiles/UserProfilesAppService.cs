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
using Academically.Services.DisciplineTaxonomyStudyLevels.Dto;
using Academically.Services.ResearchMethods.Dto;
using Academically.Services.SupportServices.Dto;
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
        private readonly IRepository<DisciplineTaxonomyStudylevel, int> _disciplineTaxonomyStudyLevelsRepository;
        private readonly IRepository<UserResearchMethod, Guid> _userResearchMethodsRepository;
        private readonly IRepository<UserSupportService, Guid> _userSupportServicesRepository;
        private readonly RoleManager _roleManager;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public UserProfilesAppService(
            IRepository<UserProfile, Guid> userProfilesRepository,
            IRepository<User, long> usersRepository,
            IRepository<UserDisciplineTaxonomy, Guid> userDisciplineTaxonomiesRepository,
            IRepository<UserResearchMethod, Guid> userResearchMethodsRepository,
            IRepository<UserSupportService, Guid> userSupportServicesRepository,
            RoleManager roleManager,
            ISettingManager settingManager,
            IFileManagerService fileManagerService,
            IRepository<UserDisciplineTaxonomyStudyLevel, int> userDisciplineTaxonomyStudyLevelsRepository,
            IRepository<DisciplineTaxonomyStudylevel, int> disciplineTaxonomyStudyLevelsRepository
            )
        {
            _userProfilesRepository = userProfilesRepository;
            _usersRepository = usersRepository;
            _userDisciplineTaxonomiesRepository = userDisciplineTaxonomiesRepository;
            _userResearchMethodsRepository = userResearchMethodsRepository;
            _userSupportServicesRepository = userSupportServicesRepository;
            _roleManager = roleManager;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
            _userDisciplineTaxonomyStudyLevelsRepository = userDisciplineTaxonomyStudyLevelsRepository;
            _disciplineTaxonomyStudyLevelsRepository = disciplineTaxonomyStudyLevelsRepository;
        }

        [AbpAuthorize(PermissionNames.Pages_Account_Details)]
        public async Task<GetProfileDetailDto> GetDetail(long userId)
        {
            var user = await _usersRepository.GetAll()
                .Include(e => e.Roles)
                .FirstOrDefaultAsync(e => e.Id == userId);

            if (user == null)
            {
                return new GetProfileDetailDto();
            }

            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == userId);
            var role = await _roleManager.GetRoleByIdAsync(user.Roles.FirstOrDefault().RoleId);

            var output = ObjectMapper.Map<GetProfileDetailDto>(userProfile);
            if (output == null)
            {
                output = new GetProfileDetailDto();
            }
            output.UserId = user.Id;
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

            foreach(var disciplineTaxonomies in userDisciplineTaxonomies)
            {
                var studyLevel = await _userDisciplineTaxonomyStudyLevelsRepository.GetAll()
                    .Where(e => e.UserId == userId && e.DisciplineTaxonomyId == disciplineTaxonomies.DisciplineTaxonomy.Id)
                    .ToListAsync();

                if(studyLevel.Any())
                    disciplineTaxonomies.LevelId = studyLevel.OrderByDescending(e => e.DisciplineTaxonomyStudyLevelId).FirstOrDefault().DisciplineTaxonomyStudyLevelId;
            }

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
            var userDisciplineTaxonomy = _userDisciplineTaxonomiesRepository.Get(userDisciplineTaxonomyId);
            await _userDisciplineTaxonomiesRepository.DeleteAsync(userDisciplineTaxonomyId);
            await _userDisciplineTaxonomyStudyLevelsRepository.DeleteAsync(e => e.DisciplineTaxonomyId == userDisciplineTaxonomy.DisciplineTaxonomyId && e.UserId == AbpSession.UserId.Value);
        }

        public async Task<IEnumerable<DisciplineTaxonomyStudyLevelDto>> GetUserDisciplineTaxonomyStudyLevels(long userId, Guid disciplineTaxonomyId)
        {
            var disciplineStudyLevels = new List<DisciplineTaxonomyStudyLevelDto>();

            var userDiscplineStudyLevels = GetUserDisciplineTaxonomyStudyLevelIds(userId, disciplineTaxonomyId);
            disciplineStudyLevels = await _disciplineTaxonomyStudyLevelsRepository.GetAll()
                .Where(e => userDiscplineStudyLevels.Any(t => t == e.Id))
                .Select(e => ObjectMapper.Map<DisciplineTaxonomyStudyLevelDto>(e))
                .ToListAsync();

            return disciplineStudyLevels;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy_KnowledgeBase_Study_Level_Create)]
        public async Task CreateManyDisciplineTaxonomyStudyLevel(Guid disciplineTaxonomyId, IEnumerable<int> studyLevelIds)
        {
            var userDisciplineStudyLevels = _userDisciplineTaxonomyStudyLevelsRepository.DeleteAsync(e => e.DisciplineTaxonomyId == disciplineTaxonomyId && e.UserId == AbpSession.UserId.Value);
            foreach (var levelId in studyLevelIds)
            {
                var userDisciplineStudyLevel = new UserDisciplineTaxonomyStudyLevel()
                {
                    UserId = AbpSession.UserId.Value,
                    DisciplineTaxonomyId = disciplineTaxonomyId,
                    DisciplineTaxonomyStudyLevelId = levelId
                };

                await _userDisciplineTaxonomyStudyLevelsRepository.InsertAsync(userDisciplineStudyLevel);
            }
        }

        private IQueryable<int> GetUserDisciplineTaxonomyStudyLevelIds(long userId, Guid disciplineTaxonomyId)
        {
            return _userDisciplineTaxonomyStudyLevelsRepository.GetAll()
                .Where(e => e.UserId == userId && e.DisciplineTaxonomyId == disciplineTaxonomyId)
                .Select(e => e.DisciplineTaxonomyStudyLevelId);
        }

        public async Task<IEnumerable<ResearchMethodDto>> GetResearchMethods(long userId)
        {
            var userResearchMethods = await _userResearchMethodsRepository.GetAll()
                .Include(e => e.ResearchMethod)
                .Where(e => e.UserId == userId)
                .Select(e => ObjectMapper.Map<ResearchMethodDto>(e.ResearchMethod))
                .ToListAsync();

            return userResearchMethods;
        }

        public async Task CreateManyResearchMethods(IEnumerable<Guid> researchMethodIds)
        {
            foreach (var researchMethodId in researchMethodIds)
            {
                var userResearchMethod = new UserResearchMethod()
                {
                    UserId = AbpSession.UserId.Value,
                    ResearchMethodId = researchMethodId,
                };
                await _userResearchMethodsRepository.InsertAsync(userResearchMethod);
            }
        }

        public async Task DeleteResearchMethod(long userId, Guid researchMethodId)
        {
            await _userResearchMethodsRepository.DeleteAsync(e => e.UserId == userId && e.ResearchMethodId == researchMethodId);
        }

        public async Task<IEnumerable<SupportServiceDto>> GetSupportServices(long userId)
        {
            var userSupportServices = await _userSupportServicesRepository.GetAll()
                .Include(e => e.SupportService)
                .Where(e => e.UserId == userId)
                .Select(e => ObjectMapper.Map<SupportServiceDto>(e.SupportService))
                .ToListAsync();
            return userSupportServices;
        }

        public async Task CreateManySupportServices(IEnumerable<Guid> supportServiceIds)
        {
            foreach (var supportServiceId in supportServiceIds)
            {
                var userSupportService = new UserSupportService()
                {
                    UserId = AbpSession.UserId.Value,
                    SupportServiceId = supportServiceId,
                };
                await _userSupportServicesRepository.InsertAsync(userSupportService);
            }
        }

        public async Task DeleteSupportService(long userId, Guid supportServiceId)
        {
            await _userSupportServicesRepository.DeleteAsync(e => e.UserId == userId && e.SupportServiceId == supportServiceId);
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
