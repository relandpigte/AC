using Academically.Services.Timezones.Dto;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Timezones
{
    public class TimezonesAppService : AcademicallyAppServiceBase, ITimezonesAppService
    {
        public TimezonesAppService()
        {

        }

        public IEnumerable<TimezoneInfoDto> GetTimezonesList()
        {
            var timezones = TimeZoneInfo.GetSystemTimeZones();
            var result = timezones.Select(t => ObjectMapper.Map<TimezoneInfoDto>(t));
            return result;
        }

        public TimezoneInfoDto GetTimezoneInfo(string timezoneId)
        {
            var timezoneInfo = new TimezoneInfoDto();
            var timezone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
            ObjectMapper.Map(timezone, timezoneInfo);

            return timezoneInfo;
        }
    }
}
