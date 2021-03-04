using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Users.Dto;

namespace Academically.Services.Profiles.Dto
{
    public interface IProfilesAppService : IApplicationService
    {
        Task<UserDto> Get(long id);
    }
}
