using Abp.AutoMapper;
using Academically.Entities;

namespace Academically.Services.Timezones.Dto
{
    [AutoMap(typeof(TimeZone))]
    public class TimeZoneDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
