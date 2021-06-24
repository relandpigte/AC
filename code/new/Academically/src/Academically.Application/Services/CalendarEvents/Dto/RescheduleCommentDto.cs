using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;

namespace Academically.Services.CalendarEvents.Dto
{
    [AutoMap(typeof(RescheduleComment))]
    public class RescheduleCommentDto : EntityDto<Guid>
    {
        public DateTime OldStartTime { get; set; }
        public DateTime OldEndTime { get; set; }
        public DateTime NewStartTime { get; set; }
        public DateTime NewEndTime { get; set; }
        public string Comments { get; set; }
        public Guid CalendarEventId { get; set; }

        public DateTime CreationTime { get; set; }

        public UserDto CreatorUser { get; set; }
    }
}
