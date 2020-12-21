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

        public DateTime ConvertToUtc(DateTime date, string timezoneId = "")
        {
            var timezoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
            date = DateTime.SpecifyKind(date, DateTimeKind.Unspecified);
            var result = TimeZoneInfo.ConvertTimeToUtc(date, timezoneInfo);

            return result;
        }
    }
}
