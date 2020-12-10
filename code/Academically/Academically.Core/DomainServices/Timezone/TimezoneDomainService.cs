using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TimeZoneConverter;

namespace Academically.DomainServices.Timezone
{
    public class TimezoneDomainService : AcademicallyDomainServiceBase, ITimezoneDomainService
    {
        public TimezoneDomainService()
        {

        }

        public DateTime ConvertToLocal(DateTime? startDate, string timezone)
        {
            var timeZone = TZConvert.GetTimeZoneInfo(timezone);
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone.Id);
            var dateStartUtc = TimeZoneInfo.ConvertTimeFromUtc(startDate.Value, timeZoneInfo);

            return dateStartUtc;
        }

        public DateTime ConvertToUtc(DateTime? startDate, string timezone)
        {
            var timeZone = TZConvert.GetTimeZoneInfo(timezone);
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone.Id);
            var dateStartUtc = TimeZoneInfo.ConvertTimeToUtc(startDate.Value, timeZoneInfo);

            return dateStartUtc;
        }
    }
}
