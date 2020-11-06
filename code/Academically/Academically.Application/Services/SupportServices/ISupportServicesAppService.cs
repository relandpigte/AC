using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.SupportServices.Dto;

namespace Academically.Services.SupportServices
{
    public interface ISupportServicesAppService : IApplicationService
    {
        Task<IEnumerable<SupportServiceDto>> GetAll(long userId);
        Task RequestSupportService(SupportServiceRequestDto input);
    }
}
