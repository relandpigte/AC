using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Auditing;
using Academically.Authorization.Users;
using Academically.Sessions.Dto;

namespace Academically.Sessions
{
    public class SessionAppService : AcademicallyAppServiceBase, ISessionAppService
    {
        private readonly UserManager _userManager;

        public SessionAppService(
            UserManager userManager
            )
        {
            _userManager = userManager;
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
                output.User.Roles = await _userManager.GetRolesAsync(user);
            }

            return output;
        }
    }
}
