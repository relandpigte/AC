using Abp.Timing;
using System;

namespace Academically.Services.CalendarEvents.Dto
{
    [DisableDateTimeNormalization]
    public class GetBusinessHoursRequestDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
