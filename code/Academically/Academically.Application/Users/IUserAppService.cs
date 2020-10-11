using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Roles.Dto;
using Academically.Users.Dto;

namespace Academically.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();

        Task ChangeLanguage(ChangeUserLanguageDto input);

        Task<bool> ChangePassword(ChangePasswordDto input);
        Task<bool> GetUserTwoFactorAuthenticationStatus(long userId);
        Task<EnableAuthenticatorModelDto> GetUserTwoFactorAuthenticationAsync(long userId);
        Task<EnableAuthenticatorModelDto> EnableUserTwoFactorAuthenticationAsync(long userId, string code);
    }
}
