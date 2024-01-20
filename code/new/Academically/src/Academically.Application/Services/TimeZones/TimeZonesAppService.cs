using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.Timing.Timezone;
using Academically.Services.TimeZones.Dto;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Runtime.Session;
using TimeZone = Academically.Domain.Entities.TimeZone;

namespace Academically.Services.TimeZones
{
    public class TimeZonesAppService : AcademicallyAppServiceBase, ITimeZonesAppService
    {
        private readonly IRepository<TimeZone, string> _timeZonesRepository;
        private readonly ISettingManager _settingManager;

        public TimeZonesAppService(
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
                .Select(e => ObjectMapper.Map<TimeZoneDto>(e))
                .ToListAsync();
            foreach (var timeZone in timeZones)
            {
                timeZone.IanaName = TimezoneHelper.WindowsToIana(timeZone.Id);
            }
            return timeZones;
        }

        public async Task<TimeZoneDto> GetAsync()
        {
            var id = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);
            var timeZone = await _timeZonesRepository.GetAsync(id);
            var output = ObjectMapper.Map<TimeZoneDto>(timeZone);
            output.IanaName = TimezoneHelper.WindowsToIana(output.Id);
            return output;
        }
        
        public async Task<TimeZoneDto> GetByUserAsync(long userId)
        {
            var id = await _settingManager.GetSettingValueForUserAsync(TimingSettingNames.TimeZone,
                AbpSession.GetTenantId(), userId);
            var timeZone = await _timeZonesRepository.GetAsync(id);
            var output = ObjectMapper.Map<TimeZoneDto>(timeZone);
            output.IanaName = TimezoneHelper.WindowsToIana(output.Id);
            return output;
        }

        public async Task UpdateUserTimeZone(TimeZoneDto input)
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            await _settingManager.ChangeSettingForUserAsync(user.ToUserIdentifier(), TimingSettingNames.TimeZone, input.Id);
        }
    }
}
