using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.ResearchMethods.Dto;

namespace Academically.Services.ResearchMethods
{
    public interface IResearchMethodsAppService : IApplicationService
    {
        Task<IEnumerable<ResearchMethodDto>> GetAll(long userId);
        Task RequestResearchMethod(ResearchMethodRequestDto input);
    }
}
