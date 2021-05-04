using Abp.AutoMapper;
using TimeZone = Academically.Domain.Entities.TimeZone;

namespace Academically.Services.TimeZones.Dto
{
    [AutoMap(typeof(TimeZone))]
    public class TimeZoneDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
