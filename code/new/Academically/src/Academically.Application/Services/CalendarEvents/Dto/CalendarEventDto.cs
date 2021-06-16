using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.CalendarEvents.Dto
{
    [AutoMap(typeof(CalendarEvent))]
    public class CalendarEventDto : EntityDto<Guid?>
    {
        public string Title { get; set; }
        public CalendarEventType Type { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public CalendarEventRecurrence Recurrence { get; set; }
        public long CreatorUserId { get; set; }
    }
}
