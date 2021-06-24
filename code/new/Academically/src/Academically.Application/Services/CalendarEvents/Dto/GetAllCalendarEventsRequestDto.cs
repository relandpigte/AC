using System;

namespace Academically.Services.CalendarEvents.Dto
{
    public class GetAllCalendarEventsRequestDto
    {
        public long UserId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
