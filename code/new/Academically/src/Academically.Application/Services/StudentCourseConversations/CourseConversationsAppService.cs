using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.StudentCourseConversations.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.StudentCourseConversations
{
    public class CourseConversationsAppService : AcademicallyAppServiceBase, ICourseConversationsAppService
    {
        private readonly IRepository<CourseConversation, Guid> _studentCourseConverstionsRepository;
        private readonly IRepository<CourseConversationReaction, Guid> _studentCourseConverstionReactionsRepository;

        public CourseConversationsAppService(
            IRepository<CourseConversation, Guid> studentCourseConverstionsRepository,
            IRepository<CourseConversationReaction, Guid> studentCourseConverstionReactionsRepository
            )
        {
            _studentCourseConverstionsRepository = studentCourseConverstionsRepository;
            _studentCourseConverstionReactionsRepository = studentCourseConverstionReactionsRepository;
        }

        public async Task<IEnumerable<CourseConversationDto>> GetAll(Guid studentCourseId)
        {
            return await _studentCourseConverstionsRepository.GetAll()
                .Where(e => e.StudentCourseId == studentCourseId && e.ParentId == null)
                .OrderBy(e => e.CreationTime)
                .Include(e => e.Children)
                .Include(e => e.CourseConversationReactions)
                .Select(e => ObjectMapper.Map<CourseConversationDto>(e))
                .ToListAsync();
        }

        public async Task<CourseConversationDto> Create(CourseConversationDto input)
        {
            var conversation = ObjectMapper.Map<CourseConversation>(input);
            input.Id = await _studentCourseConverstionsRepository.InsertAndGetIdAsync(conversation);
            return input;
        }

        public async Task<CourseConversationReactionDto> CreateReaction(CourseConversationReactionDto input)
        {
            var reaction = ObjectMapper.Map<CourseConversationReaction>(input);
            input.Id = await _studentCourseConverstionReactionsRepository.InsertAndGetIdAsync(reaction);
            return input;
        }

        public async Task DeleteReaction(Guid courseConversationReactionId)
        {
            await _studentCourseConverstionReactionsRepository.DeleteAsync(courseConversationReactionId);
        }
    }
}

