using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserProfiles.Dto;

namespace Academically.Services.UserProfiles
{
    public interface IUserProfilesAppService : IApplicationService
    {
        Task<GetProfileDetailDto> GetDetail();
        Task SaveDetail(SaveProfileDetailDto input);
    }
}
