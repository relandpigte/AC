using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserSessions.Dto
{
    [AutoMapFrom(typeof(Session))]
    public class SessionDto : EntityDto<Guid>
    {
        public string TimeZone { get; set; }
        public DateTime SessionDate { get; set; }
        public int Duration { get; set; }
        public Guid TutorOfferId { get; set; }
        public SessionStatus Status { get; set; }

    }
}
