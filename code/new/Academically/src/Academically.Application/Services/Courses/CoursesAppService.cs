using System;
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
using Academically.Services.Courses.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Courses
{
    [AbpAuthorize(PermissionNames.Pages_Courses, PermissionNames.Pages_Home_Courses)]
    public class CoursesAppService : AsyncCrudAppService<Course, CourseDto, Guid, PagedCourseResultRequestDto, CreateCourseDto, CourseDto>, ICoursesAppService
    {
        private readonly IDocumentsDomainService _documentsDomainService;

        public CoursesAppService(
            IRepository<Course, Guid> coursesRepository,
            IDocumentsDomainService documentsDomainService
            ) : base(coursesRepository)
        {
            _documentsDomainService = documentsDomainService;
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

        public async Task<CourseDto> UpdateDetails([FromForm] UpdateCourseDetailsDto input)
        {
            var course = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, course);

            if (input.File != null)
            {
                var oldDocumentId = course.ImageDocumentId;
                var courseImageDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.File, DocumentType.CourseImage);
                course.ImageDocumentId = courseImageDocument.Id;

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
            course.Type = CourseType.Standard;
            await Repository.UpdateAsync(course);
            return ObjectMapper.Map<CourseDto>(course);
        }
    }
}
