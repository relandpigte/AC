using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.SpokenLanugages.Dto;

namespace Academically.Services.SpokenLanugages
{
    public interface ISpokenLanguageAppService : IApplicationService
    {
        Task<IEnumerable<SpokenLanguageDto>> GetAll();
    }
}
