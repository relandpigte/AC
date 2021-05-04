using Abp.Application.Services;
using Academically.Services.TimeZones.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.TimeZones
{
    public interface ITimeZonesAppService : IApplicationService
    {
        Task<IEnumerable<TimeZoneDto>> GetAllAsync();
        Task<TimeZoneDto> GetAsync();
    }
}
