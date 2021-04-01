using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserResearchInterests.Dto;

namespace Academically.Services.UserResearchInterests
{
    public interface IUserResearchInterestsAppService : IApplicationService
    {
        Task Create(UserResearchInterestDto input);
    }
}
