using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Timing;
using Academically.Services.Timezones.Dto;
using Microsoft.EntityFrameworkCore;
using TimeZone = Academically.Entities.TimeZone;

namespace Academically.Services.Timezones
{
    public class TimezonesAppService : AcademicallyAppServiceBase, ITimezonesAppService
    {
        private readonly IRepository<TimeZone, string> _timeZonesRepository;
        private readonly ISettingManager _settingManager;

        public TimezonesAppService(
            IRepository<TimeZone, string> timeZonesRepository,
            ISettingManager settingManager
            )
        {
            _timeZonesRepository = timeZonesRepository;
            _settingManager = settingManager;
        }

        public async Task<IEnumerable<TimeZoneDto>> GetAllAsync()
        {
            var timeZones = await _timeZonesRepository.GetAll()
                .OrderBy(e => e.DisplayOrder)
                .ToListAsync();
            var result = timeZones.Select(t => ObjectMapper.Map<TimeZoneDto>(t));
            return result;
        }

        public async Task<TimeZoneDto> GetAsync()
        {
            var id = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);
            var timeZone = await _timeZonesRepository.GetAsync(id);
            var output = ObjectMapper.Map<TimeZoneDto>(timeZone);
            return output;
        }
    }
}
