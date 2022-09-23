using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Extensions;
using Academically.Services.Courses.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Courses
{
    [AbpAuthorize(PermissionNames.Pages_Courses, PermissionNames.Pages_Home_Courses)]
    public class CoursesAppService : AsyncCrudAppService<Course, CourseDto, Guid, PagedCourseResultRequestDto, CreateCourseDto, CourseDto>, ICoursesAppService
    {
        private readonly IRepository<CourseRating, Guid> _ratingRepository;
        private readonly IRepository<StudentCourse, Guid> _studentCourseRepository;
        private readonly IRepository<CourseSection, Guid> _sectionRepository;
        private readonly IRepository<StudentCourseSection, Guid> _courseSectionRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public CoursesAppService(
            IRepository<Course, Guid> coursesRepository,
            IRepository<CourseRating, Guid> ratingRepository,
            IRepository<StudentCourse, Guid> studentCourseRepository,
            IRepository<CourseSection, Guid> sectionRepository,
            IRepository<StudentCourseSection, Guid> courseSectionRepository,
            IDocumentsDomainService documentsDomainService
            ) : base(coursesRepository)
        {
            _ratingRepository = ratingRepository;
            _studentCourseRepository = studentCourseRepository;
            _sectionRepository = sectionRepository;
            _documentsDomainService = documentsDomainService;
            _courseSectionRepository = courseSectionRepository;
        }

        public override async Task<CourseDto> GetAsync(EntityDto<Guid> input)
        {
            var course = await Repository.GetAll()
                .Where(e => e.Id == input.Id)
                .Include(e => e.ImageDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.CoverPhotoDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.StudentCourses)
                .FirstOrDefaultAsync();
            var output = ObjectMapper.Map<CourseDto>(course);
            output.CourseImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocument);
            return output;
        }

        protected override IQueryable<Course> CreateFilteredQuery(PagedCourseResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == AbpSession.UserId.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StatusFilter.HasValue, e => e.Status == input.StatusFilter.Value)
                .Include(e => e.StudentCourses);
        }

        public override async Task<PagedResultDto<CourseDto>> GetAllAsync(PagedCourseResultRequestDto input)
        {
            var output = await base.GetAllAsync(input);
            foreach (var item in output.Items)
            {
                if (item.ImageDocumentId.HasValue)
                {
                    item.CourseImageUrl = await _documentsDomainService.GetFileUrlAsync(item.ImageDocumentId.Value);
                }
            }
            return output;
        }

        public async Task<Dictionary<string, List<CourseDto>>> GetByTopicAsync()
        {
            var courses = await Repository.GetAll()
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();
            return courses.GroupByTopicExt();
        }

        public async Task<Dictionary<string, List<CourseDto>>> GetByDatesAsync(DateGrains grain, int itemsPerGroup = 6)
        {
            var courses = await Repository.GetAll()
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();
            return courses.GroupByDateRangeExt(grain, itemsPerGroup);
        }

        public async Task<CourseDto> UpdateDetails([FromForm] UpdateCourseDetailsDto input)
        {
            var course = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, course);

            if (input.ImageDocumentFile != null)
            {
                var oldDocumentId = course.ImageDocumentId;
                var document = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.ImageDocumentFile, DocumentType.CourseImage);
                course.ImageDocumentId = document.Id;

                if (oldDocumentId.HasValue)
                {
                    await _documentsDomainService.DeleteAsync(oldDocumentId.Value);
                }
            }

            await Repository.UpdateAsync(course);
            return ObjectMapper.Map<CourseDto>(course);
        }

        public async Task<CourseDto> UpdateSettings(UpdateCourseSettingsDto input)
        {
            var course = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, course);
            return ObjectMapper.Map<CourseDto>(await Repository.UpdateAsync(course));
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            await _ratingRepository.DeleteAsync(cr => cr.CourseId == input.Id);
            await _sectionRepository.DeleteAsync(cs => cs.CourseId == input.Id);

            var studentCourses = await _sectionRepository.GetAll().Where(sc => sc.CourseId == input.Id).ToListAsync();
            foreach (var studentCourse in studentCourses)
            {
                await _courseSectionRepository.DeleteAsync(scs => scs.CourseSectionId == studentCourse.Id);
            }

            await _studentCourseRepository.DeleteAsync(sc => sc.CourseId == input.Id);
            
            await Repository.DeleteAsync(input.Id);
        }
    }
}
