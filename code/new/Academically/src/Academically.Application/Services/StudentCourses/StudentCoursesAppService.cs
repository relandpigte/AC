using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.StudentCourses.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.StudentCourses
{
    public class StudentCoursesAppService : AcademicallyAppServiceBase, IStudentCoursesAppService
    {
        private readonly IRepository<StudentCourse, Guid> _studentCoursesRepository;
        private readonly IRepository<CourseSection, Guid> _courseSectionsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public StudentCoursesAppService(
            IRepository<StudentCourse, Guid> studentCoursesRepository,
            IRepository<CourseSection, Guid> courseSectionsRepository,
            DocumentsDomainService documentsDomainService
            )
        {
            _studentCoursesRepository = studentCoursesRepository;
            _courseSectionsRepository = courseSectionsRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<PagedResultDto<StudentCourseDto>> GetAll(PagedStudentCourseResultRequestDto input)
        {
            var query = _studentCoursesRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Course.Name.ToLower().Contains(input.SearchFilter.ToLower()));
            var totalCount = await query.CountAsync();
            var studentCourses = await query.OrderBy(input.Sorting)
                .Include(e => e.Course)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<StudentCourseDto>(e))
                .ToListAsync();

            foreach (var studentCourse in studentCourses)
            {
                if (studentCourse.Course.ImageDocumentId.HasValue)
                {
                    studentCourse.Course.CourseImageUrl = await _documentsDomainService.GetFileUrlAsync(studentCourse.Course.ImageDocumentId.Value);
                }
            }

            return new PagedResultDto<StudentCourseDto>()
            {
                TotalCount = totalCount,
                Items = studentCourses,
            };
        }

        public async Task<StudentCourseDto> Get(Guid courseId)
        {
            return await _studentCoursesRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value && e.CourseId == courseId)
                .Include(e => e.StudentCourseSections)
                    .ThenInclude(e => e.CourseSection)
                .Select(e => ObjectMapper.Map<StudentCourseDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task Create(Guid courseId)
        {
            var courseSections = await _courseSectionsRepository.GetAll()
                .Where(e => e.CourseId == courseId && e.ParentId == null)
                .Include(e => e.Children)
                    .ThenInclude(e => e.Children)
                .ToListAsync();

            var studentCourse = new StudentCourse()
            {
                CourseId = courseId,
            };
            foreach (var moduleOrLessonSection in courseSections)
            {
                studentCourse.StudentCourseSections.Add(new StudentCourseSection()
                {
                    Status = StudentCourseSectionStatus.NotStarted,
                    CourseSectionId = moduleOrLessonSection.Id,
                });
                if (moduleOrLessonSection.Children.Any())
                {
                    foreach (var unitOrLessonSection in moduleOrLessonSection.Children)
                    {
                        studentCourse.StudentCourseSections.Add(new StudentCourseSection()
                        {
                            Status = StudentCourseSectionStatus.NotStarted,
                            CourseSectionId = unitOrLessonSection.Id,
                        });
                        if (unitOrLessonSection.Children.Any())
                        {
                            foreach (var lessonSection in unitOrLessonSection.Children)
                            {
                                studentCourse.StudentCourseSections.Add(new StudentCourseSection()
                                {
                                    Status = StudentCourseSectionStatus.NotStarted,
                                    CourseSectionId = lessonSection.Id,
                                });
                            }
                        }
                    }
                }
            }
            await _studentCoursesRepository.InsertAsync(studentCourse);
        }
    }
}

