using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Projects.Dto;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;

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
        public Guid? ProjectId { get; set; }
        public long CreatorUserId { get; set; }
        public UserDto CreatorUser { get; set; }

        public long TutorId { get; set; }

        public Guid? ProjectOfferId { get; set; }
        public ProjectOffer ProjectOffer { get; set; }

        public ProjectDto Project { get; set; }
        public IEnumerable<RescheduleCommentDto> RescheduleComments { get; set; }
    }
}
