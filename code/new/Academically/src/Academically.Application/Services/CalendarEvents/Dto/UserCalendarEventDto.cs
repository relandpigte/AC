using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.CalendarEvents.Dto
{
    [AutoMap(typeof(UserCalendarEvent))]
    public class UserCalendarEventDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public Guid CalendarEventId { get; set; }
    }
}
