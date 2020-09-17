using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Auditing;
using Abp.Domain.Repositories;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Academically.Entities;
using Academically.Sessions.Dto;

namespace Academically.Sessions
{
    public class SessionAppService : AcademicallyAppServiceBase, ISessionAppService
    {
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IFileManagerService _fileManagerService;

        public SessionAppService(
            IRepository<UserProfile, Guid> userProfilesRepository,
            IFileManagerService fileManagerService
            )
        {
            _userProfilesRepository = userProfilesRepository;
            _fileManagerService = fileManagerService;
        }

        [DisableAuditing]
        public async Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations()
        {
            var output = new GetCurrentLoginInformationsOutput
            {
                Application = new ApplicationInfoDto
                {
                    Version = AppVersionHelper.Version,
                    ReleaseDate = AppVersionHelper.ReleaseDate,
                    Features = new Dictionary<string, bool>()
                }
            };

            if (AbpSession.TenantId.HasValue)
            {
                output.Tenant = ObjectMapper.Map<TenantLoginInfoDto>(await GetCurrentTenantAsync());
            }

            if (AbpSession.UserId.HasValue)
            {
                var user = await GetCurrentUserAsync();
                output.User = ObjectMapper.Map<UserLoginInfoDto>(user);
                output.User.Roles = await UserManager.GetRolesAsync(user);
                var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
                if (userProfile != null)
                {
                    output.User.ProfilePictureUrl = _fileManagerService.GetFileUrl(userProfile.ProfilePictureFileName, user.Id, AppSettingNames.Aws_S3_Folders_ProfilePictures);
                }
            }

            return output;
        }
    }
}
