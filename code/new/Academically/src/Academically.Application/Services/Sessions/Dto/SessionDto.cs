using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.CalendarEvents.Dto;
using System;
using System.Collections.Generic;

namespace Academically.Services.Sessions.Dto
{
    [AutoMap(typeof(Session))]
    public class SessionDto : EntityDto<Guid>
    {
        public string Offer { get; set; }
        public string Answer { get; set; }
        public Guid CalendarEventId { get; set; }
        public Guid ConversationGroupId { get; set; }

        public CalendarEventDto CalendarEvent { get; set; }

        public IEnumerable<SessionCandidateDto> SessionCandidates { get; set; }
    }
}
