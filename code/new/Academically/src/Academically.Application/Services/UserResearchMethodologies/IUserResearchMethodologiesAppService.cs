using Abp.Application.Services.Dto;
using Academically.Services.UserResearchMethodologies.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.UserResearchMethodologies
{
    public interface IUserResearchMethodologiesAppService
    {
        Task<PagedResultDto<UserResearchMethodologyDto>> GetPaged(PagedUserResearchMethodologiesRequestDto input);
        Task Create(UserResearchMethodologyDto input);
        Task Edit(UserResearchMethodologyDto input);
        Task Delete(Guid id);
    }
}
