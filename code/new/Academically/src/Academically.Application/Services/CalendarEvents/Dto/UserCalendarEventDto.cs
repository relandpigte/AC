using Abp.AutoMapper;
using Abp.Domain.Entities;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.CalendarEvents.Dto
{
    [AutoMap(typeof(UserCalendarEvent))]
    public class UserCalendarEventDto : Entity<Guid>
    {
        public long UserId { get; set; }
        public Guid CalendarEventId { get; set; }
    }
}
