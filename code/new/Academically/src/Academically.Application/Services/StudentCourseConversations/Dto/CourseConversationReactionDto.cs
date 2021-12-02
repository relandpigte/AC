using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.StudentCourseConversations.Dto
{
    [AutoMap(typeof(CourseConversationReaction))]
    public class CourseConversationReactionDto : EntityDto<Guid>
    {
        public ConversationReactionType Type { get; set; }
        public Guid CourseConversationId { get; set; }
        public long CreatorUserId { get; set; }

        public CourseConversationDto CourseConversation { get; set; }

        public CourseConversationReactionDto()
        {
        }
    }
}

