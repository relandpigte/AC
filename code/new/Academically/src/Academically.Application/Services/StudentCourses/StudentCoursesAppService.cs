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

        public async Task<PagedResultDto<StudentCourseDto>> GetAllStudents(PagedCourseStudentResultRequestDto input)
        {
            var query = _studentCoursesRepository.GetAll()
                .Where(e => e.CourseId == input.CourseIdFilter)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.CreatorUser.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.CreatorUser.Surname.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Progress.ToString().ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.MinimumProgressFilter.HasValue, e => e.Progress < input.MinimumProgressFilter.Value );
            var totalCount = await query.CountAsync();
            var courseStudents = await query.OrderBy(input.Sorting)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<StudentCourseDto>(e))
                .ToListAsync();

            return new PagedResultDto<StudentCourseDto>()
            {
                TotalCount = totalCount,
                Items = courseStudents,
            };
        }

        public async Task<StudentCourseDto> Get(Guid id)
        {
            var studentCourse = await _studentCoursesRepository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.CoverPhotoDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.UserEducations)
                        .ThenInclude(e => e.University)
                .Include(e => e.Course)
                .FirstOrDefaultAsync();

            var output = ObjectMapper.Map<StudentCourseDto>(studentCourse);
            if (studentCourse.CreatorUser.UserEducations != null && studentCourse.CreatorUser.UserEducations.Count > 0)
            {
                output.CreatorUser.CurrentUniversity = studentCourse.CreatorUser.UserEducations
                    .OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                   .FirstOrDefault()
                   .University.HeProvider;
            }

            return output;
        }

        public async Task<StudentCourseDto> GetWithSections(Guid id)
        {
            var studentCourse = await _studentCoursesRepository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.CoverPhotoDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.UserEducations)
                        .ThenInclude(e => e.University)
                .Include(e => e.Course)
                .Include(e => e.StudentCourseSections)
                    .ThenInclude(e => e.CourseSection)
                .FirstOrDefaultAsync();

            var output = ObjectMapper.Map<StudentCourseDto>(studentCourse);
            if (studentCourse.CreatorUser.UserEducations != null && studentCourse.CreatorUser.UserEducations.Count > 0)
            {
                output.CreatorUser.CurrentUniversity = studentCourse.CreatorUser.UserEducations
                    .OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                   .FirstOrDefault()
                   .University.HeProvider;
            }

            return output;
        }

        public async Task<StudentCourseDto> GetByCourse(Guid courseId)
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

