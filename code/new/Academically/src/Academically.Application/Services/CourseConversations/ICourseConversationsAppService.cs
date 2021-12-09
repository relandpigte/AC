using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.CourseConversations.Dto;

namespace Academically.Services.CourseConversations
{
    public interface ICourseConversationsAppService : IApplicationService
    {
        Task<IEnumerable<CourseConversationDto>> GetAll(Guid studentCourseId);
        Task<IEnumerable<GetStudentsCourseConversationDto>> GetStudents(Guid courseId);
        Task<CourseConversationDto> Create(CourseConversationDto input);
        Task<CourseConversationReactionDto> CreateReaction(CourseConversationReactionDto input);
        Task DeleteReaction(Guid courseConversationReactionId);
    }
}

