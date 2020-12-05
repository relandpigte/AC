using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Application.Shared.Services;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.Widgets.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Widgets
{
    [AbpAuthorize(PermissionNames.Pages_Dashboard_Widgets)]
    public class WidgetsAppService : AcademicallyAppServiceBase, IWidgetsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IFileManagerService _fileManagerService;

        public WidgetsAppService(
            RoleManager roleManager,
            IRepository<UserProfile, Guid> userProfilesRepository,
            IRepository<User, long> usersRepository,
            IFileManagerService fileManagerService
            )
        {
            _roleManager = roleManager;
            _userProfilesRepository = userProfilesRepository;
            _usersRepository = usersRepository;
            _fileManagerService = fileManagerService;
        }

        [AbpAuthorize(PermissionNames.Pages_Dashboard_Widgets_ProfileSummary)]
        public async Task<ProfileSummaryWidgetDto> GetProfileSummary()
        {
            var userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAll()
                .Include(e => e.Roles)
                .FirstOrDefaultAsync(e => e.Id == userId);
            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == userId);
            var role = await _roleManager.GetRoleByIdAsync(user.Roles.FirstOrDefault().RoleId);

            var output = new ProfileSummaryWidgetDto()
            {
                FullName = user.FullName,
                Role = role.DisplayName,
                Status = user.IsActive ? L("Active") : L("Inactive"),
                Progress = 83, // @TODO: Change this value to the actual percentage of the profile setup process
                ProfilePictureFileName = userProfile?.ProfilePictureFileName,
            };

            return output;
        }
    }
}
