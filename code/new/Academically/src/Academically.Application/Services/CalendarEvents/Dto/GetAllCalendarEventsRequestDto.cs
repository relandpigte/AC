using Academically.Domain.Enums;
using System;

namespace Academically.Services.CalendarEvents.Dto
{
    public class GetAllCalendarEventsRequestDto
    {
        public CalendarEventType Type { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public long UserId { get; set; }
    }
}
