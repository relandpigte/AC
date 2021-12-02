using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.StudentCourses.Dto;

namespace Academically.Services.StudentCourseConversations.Dto
{
    [AutoMap(typeof(CourseConversation))]
    public class CourseConversationDto : EntityDto<Guid>
    {
        public string Message { get; set; }
        public bool IsSeen { get; set; }
        public Guid StudentCourseId { get; set; }
        public Guid? ParentId { get; set; }
        public DateTime CreationTime { get; set; }

        public StudentCourseDto StudentCourse { get; set; }
        public CourseConversationDto Parent { get; set; }

        public IEnumerable<CourseConversationDto> Children { get; set; }
        public IEnumerable<CourseConversationReactionDto> CourseConversationReactions { get; set; }
    }
}

