using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.UserResearchInterests.Dto;

namespace Academically.Services.UserResearchInterests
{
    public interface IUserResearchInterestsAppService : IApplicationService
    {
        Task<PagedResultDto<UserResearchInterestDto>> GetPaged(PagedUserResearchInterestRequestDto input);
        Task Create(UserResearchInterestDto input);
        Task Edit(UserResearchInterestDto input); 
        Task Delete(Guid id);
    }
}
