using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Timezones.Dto;

namespace Academically.Services.Timezones
{
    public interface ITimezonesAppService : IApplicationService
    {
        Task<IEnumerable<TimeZoneDto>> GetAllAsync();
        Task<TimeZoneDto> GetAsync();
    }
}
