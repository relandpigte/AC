using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.EducationLevels.Dto;

namespace Academically.Services.EducationLevels
{
    public interface IEducationLevelsAppService : IApplicationService
    {
        Task<IEnumerable<EducationLevelDto>> GetAll();
    }
}
