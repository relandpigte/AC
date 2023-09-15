using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Roles.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Academically.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();

        Task ChangeLanguage(ChangeUserLanguageDto input);

        Task<bool> ChangePassword(ChangePasswordDto input);

        Task<UserStatusLogDto> GetUserStatusLog(long userId);

        Task CreateUserStatusLog([FromForm] UserStatus status);

        Task<List<UserStatusLogDto>> GetAllUserStatusLogs();
    }
}
