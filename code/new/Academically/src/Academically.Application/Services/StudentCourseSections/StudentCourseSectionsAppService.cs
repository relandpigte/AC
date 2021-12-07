using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.StudentCourseSections.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.StudentCourseSections
{
    public class StudentCourseSectionsAppService : AcademicallyAppServiceBase, IStudentCourseSectionsAppService
    {
        private readonly IRepository<StudentCourseSection, Guid> _studentCourseSectionsRepository;
        private readonly IRepository<StudentCourse, Guid> _studentCoursesRepository;

        public StudentCourseSectionsAppService(
            IRepository<StudentCourseSection, Guid> studentCourseSectionsRepository,
            IRepository<StudentCourse, Guid> studentCoursesRepository
            )
        {
            _studentCourseSectionsRepository = studentCourseSectionsRepository;
            _studentCoursesRepository = studentCoursesRepository;
        }

        public async Task<IEnumerable<StudentCourseSectionDto>> GetAll(Guid courseId)
        {
            return await _studentCourseSectionsRepository.GetAll()
                .Where(e => e.CourseSection.CourseId == courseId && e.CourseSection.ParentId == null)
                .Include(e => e.CourseSection)
                    .ThenInclude(e => e.Children)
                        .ThenInclude(e => e.Children)
                .OrderBy(e => e.CourseSection.DisplayOrder)
                .Select(e => ObjectMapper.Map<StudentCourseSectionDto>(e))
                .ToListAsync();
        }

        public async Task<IEnumerable<StudentCourseSectionDto>> GetAssignmentsAllowed(Guid courseId)
        {
            var studentCourseSections = await _studentCourseSectionsRepository.GetAll()
                .Where(e => e.CourseSection.CourseId == courseId && e.CreatorUserId == AbpSession.UserId.Value && e.CourseSection.IsAssignmentEnabled)
                .Include(e => e.CourseSection)
                .OrderBy(e => e.CourseSection.DisplayOrder)
                .Select(e => ObjectMapper.Map<StudentCourseSectionDto>(e))
                .ToListAsync();
            return studentCourseSections;
        }

        public async Task UpdateStatus(Guid id, StudentCourseSectionStatus status)
        {
            var studentCourseSection = await _studentCourseSectionsRepository.GetAsync(id);
            studentCourseSection.Status = status;
            await _studentCourseSectionsRepository.UpdateAsync(studentCourseSection);

            var studentCourse = await _studentCoursesRepository.GetAll()
                .Where(e => e.Id == studentCourseSection.StudentCourseId)
                .Include(e => e.StudentCourseSections)
                .FirstOrDefaultAsync();
            decimal totalCount = studentCourse.StudentCourseSections.Count();
            decimal finishedCount = studentCourse.StudentCourseSections.Count(e => e.Status == StudentCourseSectionStatus.Finished);
            studentCourse.Progress = finishedCount / totalCount * 100m;
            await _studentCoursesRepository.UpdateAsync(studentCourse);
        }
    }
}

