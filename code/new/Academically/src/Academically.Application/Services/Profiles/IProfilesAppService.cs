using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Users.Dto;

namespace Academically.Services.Profiles
{
    public interface IProfilesAppService : IApplicationService
    {
        Task<UserDto> Get(long id);
        Task UpdateWebsiteUrl(string websiteUrl);
    }
}
