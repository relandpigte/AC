using System;
using Academically.Users.Dto;

namespace Academically.Services.CourseConversations.Dto
{
    public class GetStudentsCourseConversationDto
    {
        public Guid StudentCourseId { get; set; }
        public UserDto User { get; set; }
        public CourseConversationDto LastCourseConversation { get; set; }
    }
}

