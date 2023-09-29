using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;
using Academically.Services.Articles.Dto;
using Academically.Services.Coachings.Dto;
using Academically.Services.Courses.Dto;
using Academically.Services.Events.Dto;
using Academically.Services.Videos.Dto;

namespace Academically.Services.Chats.Dto
{
    [AutoMap(typeof(ChannelMessage))]
    public class ChannelMessageDto : FullAuditedEntity<Guid>
    {
        public string Message { get; set; }
        public DateTime? IsSeen { get; set; }
        public Guid? ParentId { get; set; }
        public Guid? ServiceId { get; set; }
        public ServicesType? ServiceType { get; set; }
        public Guid? ReferenceId { get; set; }
        public Guid ChannelId { get; set; }
        public UserDto CreatorUser { get; set; }
        public ChannelMessageDto Parent { get; set; }
        public ChannelDto Channel { get; set; }
        
        public IEnumerable<ChannelMessageAttachmentDto> ChannelMessageAttachments { get; set; }
        
        [NotMapped]
        public ArticleDto Article { get; set; }

        [NotMapped]
        public EventDto Event { get; set; }

        [NotMapped]
        public CourseDto Course { get; set; }

        [NotMapped]
        public VideoDto Video { get; set; }

        [NotMapped]
        public CoachingDto Coaching { get; set; }
    }
}
