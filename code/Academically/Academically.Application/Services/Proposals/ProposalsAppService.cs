using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Collections.Extensions;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.UI;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Configuration;
using Academically.Entities;
using Academically.Entities.Enums;
using Academically.Services.Proposals.Dto;
using Academically.Services.UserProfiles.Dto;
using GeoCoordinatePortable;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace Academically.Services.Proposals
{
    public class ProposalsAppService : AcademicallyAppServiceBase, IProposalsAppService
    {
        private const double METER_TO_MILE_CONVERSION = 0.00062137;

        private readonly IRepository<UserProfile, Guid> _userProfilesAppService;
        private readonly IRepository<UserTutorial, Guid> _userTutorialRepository;
        private readonly IRepository<UserSupportService, Guid> _userSupportService;
        private readonly IRepository<UserDisciplineTaxonomy, Guid> _userDisciplineTaxonomy;
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomy;
        private readonly IFileManagerService _fileManagerService;
        private readonly ISettingManager _settingManager;
        private readonly RoleManager _roleManager;

        public ProposalsAppService(
            IRepository<UserProfile, Guid> userProfilesAppService,
            RoleManager roleManager,
            IFileManagerService fileManagerService,
            ISettingManager settingManager,
            IRepository<UserTutorial, Guid> userTutorialRepository,
            IRepository<UserSupportService, Guid> userSupportService,
            IRepository<UserDisciplineTaxonomy, Guid> userDisciplineTaxonomy,
            IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomy
            )
        {
            _userProfilesAppService = userProfilesAppService;
            _roleManager = roleManager;
            _fileManagerService = fileManagerService;
            _settingManager = settingManager;
            _userTutorialRepository = userTutorialRepository;
            _userSupportService = userSupportService;
            _userDisciplineTaxonomy = userDisciplineTaxonomy;
            _disciplineTaxonomy = disciplineTaxonomy;
        }

        public async Task<IEnumerable<SearchTutorDto>> SearchTutors(int distance, int? level)
        {
            var tutorRole = _roleManager.GetRoleByName(StaticRoleNames.Tenants.Tutor);
            var tutorialServiceTypeId = Guid.Parse(await _settingManager.GetSettingValueAsync(AppSettingNames.Services_Tutorial));
            var currentUserProfile = await _userProfilesAppService.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
            if (currentUserProfile == null)
            {
                throw new UserFriendlyException(L("AddressNotDefinedErrorMessage"));
            }
            var userLocationCoordinate = new GeoCoordinate(currentUserProfile.Latitude ?? 0, currentUserProfile.Longitude ?? 0);

            // TODO: this query is not optimized. new version of EF for .NET Core does not support GenoCoordinate.GetDistanceTo method
            // and is not able to convert it to a linq to SQL query. will need to change this code in the future to either:
            // 1.) use stored procedure and laverage Geography methods from SQL
            // 2.) find a propery way to do this using LINQ
            var userProfiles = (await _userProfilesAppService.GetAll()
                //.Include(e => e.User)
                //    .ThenInclude(e => e.UserDisciplineTaxonomyStudyLevels) 
                .Include(e => e.User)
                    .ThenInclude(e => e.UserSupportServices)
                .Include(e => e.User)
                    .ThenInclude(e => e.UserEducations)
                .Where(
                    e => e.User.Roles.Any(e => e.RoleId == tutorRole.Id) &&
                    e.User.UserSupportServices.Any(e => e.SupportServiceId == tutorialServiceTypeId) 
                )
                .ToListAsync())
                .Select(e => new
                {
                    up = e,
                    gc = (new GeoCoordinate(e.Latitude ?? 0, e.Longitude ?? 0).GetDistanceTo(userLocationCoordinate)) * METER_TO_MILE_CONVERSION
                })
                .WhereIf(distance >= 0, e => e.gc <= distance)
                .WhereIf(level != 0, e => e.up.User.UserEducations.Any(t => (int)t.Level >= level))
                //.WhereIf(level != 0, e => e.up.User.UserDisciplineTaxonomyStudyLevels.Any(t => t.DisciplineTaxonomyStudyLevelId == level)) This will be for needed later matching
                .OrderBy(e => e.gc)
                .Select(e => new UserProfile { 
                    User = e.up.User,
                    ProfilePictureFileName  = e.up.ProfilePictureFileName != null
                        ? _fileManagerService.GetFileUrl(e.up.ProfilePictureFileName, e.up.User.Id, AppSettingNames.Aws_S3_Folders_ProfilePictures)
                        : "assets/img/anonymous.png"
                })
                .Select(e => ObjectMapper.Map<SearchTutorDto>(e));

            return userProfiles;
        }

        public async Task<GetStudentProposalDto> GetStudentProposal(Guid tutorialId)
        {
            var tutorial = await _userTutorialRepository.GetAll()
                .Include(e => e.UserTutorialDisciplineTaxonomies)
                    .ThenInclude(e => e.DisciplineTaxonomy)
                .Include(e => e.User.Roles)
                .Include(e => e.User)
                .Where(e => e.Id == tutorialId)
                .Select(e => ObjectMapper.Map<GetStudentProposalDto>(e))
                .FirstOrDefaultAsync();

            if (tutorial != null)
            {
                var userProfile = await _userProfilesAppService.FirstOrDefaultAsync(e => e.UserId == tutorial.User.Id);
                tutorial.ProfilePictureFileName = userProfile.ProfilePictureFileName != null ?
                    _fileManagerService.GetFileUrl(userProfile.ProfilePictureFileName, userProfile.UserId, AppSettingNames.Aws_S3_Folders_ProfilePictures)
                    : "assets/img/anonymous.png";
            }
            
            return tutorial;

        }

        public async Task<UserSupportServiceDto> GetTutorSupportService()
        {
            var tutorialServiceTypeId = Guid.Parse(await _settingManager.GetSettingValueAsync(AppSettingNames.Services_Tutorial));

            var supportService = await _userSupportService.GetAll()
                .Include(e => e.SupportService)
                .Include(e => e.UserSupportServiceSessionRate)
                .Where(e => e.UserId == AbpSession.UserId.Value && e.SupportService.Id == tutorialServiceTypeId)
                .Select(e => ObjectMapper.Map<UserSupportServiceDto>(e))
                .FirstOrDefaultAsync();

            return supportService;
        }

        public async Task<string> GetTutorDisciplineTaxonomies()
        {
            var disciplineTaxonomies = await _userDisciplineTaxonomy.GetAll()
                .Include(e => e.DisciplineTaxonomy)
                .Where(e => e.UserId == AbpSession.UserId.Value)
                .Select(e => ObjectMapper.Map<GetUserDisciplineTaxonomyDto>(e))
                .ToListAsync();
            var discplines = disciplineTaxonomies.Select(e => e.DisciplineTaxonomy.Name);

            var result = string.Join(",", discplines);

            return result;
        }
    }
}
