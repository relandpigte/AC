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

        public StudentCourseSectionsAppService(
            IRepository<StudentCourseSection, Guid> studentCourseSectionsRepository
            )
        {
            _studentCourseSectionsRepository = studentCourseSectionsRepository;
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

        public async Task UpdateStatus(Guid id, StudentCourseSectionStatus status)
        {
            var studentCourseSection = await _studentCourseSectionsRepository.GetAsync(id);
            studentCourseSection.Status = status;
            await _studentCourseSectionsRepository.UpdateAsync(studentCourseSection);
        }
    }
}

