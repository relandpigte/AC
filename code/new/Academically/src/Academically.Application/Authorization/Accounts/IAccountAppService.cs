using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Authorization.Accounts.Dto;

namespace Academically.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);
        Task<RegisterOutput> Register(RegisterInput input);
        Task<AuthenticatorDto> GetUserTwoFactorAuthentication();
        Task EnableUserTwoFactorAuthenticationAsync(string code);
        Task DisableUserTwoFactorAuthentication();
        Task AuthenticateUserAsync(long userId, string code);
    }
}
