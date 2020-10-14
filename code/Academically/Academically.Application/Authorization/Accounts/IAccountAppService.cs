using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Accounts.Dto;
using Academically.Authorization.Accounts.Dto;

namespace Academically.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
        Task<bool> GetUserTwoFactorAuthenticationStatus(long userId);
        Task<AuthenticatorDto> GetUserTwoFactorAuthenticationAsync(long userId);
        Task<AuthenticatorDto> EnableUserTwoFactorAuthenticationAsync(long userId, string code);
    }
}
