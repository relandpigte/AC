using System;

namespace Academically.Services.CalendarEvents.Dto
{
    public class RescheduleCalendarEventDto
    {
        public CalendarEventDto CalendarEvent { get; set; }
        public DateTime OldStartTime { get; set; }
        public DateTime OldEndTime { get; set; }
        public string Comments { get; set; }
    }
}
