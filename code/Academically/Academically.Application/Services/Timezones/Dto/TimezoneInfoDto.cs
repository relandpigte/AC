using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Timezones.Dto
{
    [AutoMap(typeof(TimeZoneInfo))]
    public class TimezoneInfoDto
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public TimeSpan BaseUtcOffset { get; set; }
        public string StandardName { get; set; }
        public string DaylightName { get; set; }
    }
}
