using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.StudentCourseConversations.Dto;

namespace Academically.Services.StudentCourseConversations
{
    public interface ICourseConversationsAppService : IApplicationService
    {
        Task<IEnumerable<CourseConversationDto>> GetAll(Guid studentCourseId);
        Task<CourseConversationDto> Create(CourseConversationDto input);
        Task<CourseConversationReactionDto> CreateReaction(CourseConversationReactionDto input);
        Task DeleteReaction(Guid courseConversationReactionId);
    }
}

