using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.CourseConversations.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CourseConversations
{
    public class CourseConversationsAppService : AcademicallyAppServiceBase, ICourseConversationsAppService
    {
        private readonly IRepository<CourseConversation, Guid> _studentCourseConverstionsRepository;
        private readonly IRepository<CourseConversationReaction, Guid> _studentCourseConverstionReactionsRepository;
        private readonly IRepository<StudentCourse, Guid> _studentCoursesRepository;

        public CourseConversationsAppService(
            IRepository<CourseConversation, Guid> studentCourseConverstionsRepository,
            IRepository<CourseConversationReaction, Guid> studentCourseConverstionReactionsRepository,
            IRepository<StudentCourse, Guid> studentCoursesRepository
            )
        {
            _studentCourseConverstionsRepository = studentCourseConverstionsRepository;
            _studentCourseConverstionReactionsRepository = studentCourseConverstionReactionsRepository;
            _studentCoursesRepository = studentCoursesRepository;
        }

        public async Task<IEnumerable<CourseConversationDto>> GetAll(Guid studentCourseId)
        {
            return await _studentCourseConverstionsRepository.GetAll()
                .Where(e => e.StudentCourseId == studentCourseId && e.ParentId == null)
                .OrderByDescending(e => e.CreationTime)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.Children)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CourseConversationReactions)
                .Select(e => ObjectMapper.Map<CourseConversationDto>(e))
                .ToListAsync();
        }

        public async Task<IEnumerable<GetStudentsCourseConversationDto>> GetStudents(Guid courseId)
        {
            var students = await _studentCoursesRepository.GetAll()
                .Where(e => e.CourseId == courseId)
                .Include(e => e.CreatorUser.ProfilePictureDocument)
                .Select(e => new GetStudentsCourseConversationDto()
                {
                    StudentCourseId = e.Id,
                    User = ObjectMapper.Map<UserDto>(e.CreatorUser),
                })
                .ToListAsync();

            foreach (var student in students)
            {
                student.LastCourseConversation = await _studentCourseConverstionsRepository.GetAll()
                    .Where(e => e.CreatorUserId == student.User.Id)
                    .OrderByDescending(e => e.CreationTime)
                    .Select(e => ObjectMapper.Map<CourseConversationDto>(e))
                    .FirstOrDefaultAsync();
            }

            return students.OrderByDescending(e => e.LastCourseConversation?.CreationTime);
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

