using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Auditing;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Services.Documents;
using Academically.Sessions.Dto;

namespace Academically.Sessions
{
    public class SessionAppService : AcademicallyAppServiceBase, ISessionAppService
    {
        private readonly UserManager _userManager;
        private readonly IDocumentsDomainService _documentsDomainService;

        public SessionAppService(
            UserManager userManager,
            IDocumentsDomainService documentsDomainService
            )
        {
            _userManager = userManager;
            _documentsDomainService = documentsDomainService;
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
                    Features = new Dictionary<string, bool>(),
                    BaseDirectory = _documentsDomainService.GetBaseDirectory(),
                    ProfilePicturesFolderName = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_ProfilePictures),
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
                output.User.Roles = await _userManager.GetRolesAsync(user);

                if (user.ProfilePictureDocumentId.HasValue)
                {
                    output.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(user.ProfilePictureDocumentId.Value);
                }
            }

            return output;
        }
    }
}
