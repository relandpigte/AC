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
using Abp.Runtime.Session;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.EntityFrameworkCore.Repositories.Explore;
using Academically.Extensions;
using Academically.Services.Courses.Dto;
using Academically.Services.Explore.Dto;
using Academically.Services.Videos.Dto;
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
        private readonly IExploreRepository _exploreRepository;

        public CoursesAppService(
            IRepository<Course, Guid> coursesRepository,
            IRepository<CourseRating, Guid> ratingRepository,
            IRepository<StudentCourse, Guid> studentCourseRepository,
            IRepository<CourseSection, Guid> sectionRepository,
            IRepository<StudentCourseSection, Guid> courseSectionRepository,
            IDocumentsDomainService documentsDomainService,
            IExploreRepository exploreRepository
            ) : base(coursesRepository)
        {
            _ratingRepository = ratingRepository;
            _studentCourseRepository = studentCourseRepository;
            _sectionRepository = sectionRepository;
            _documentsDomainService = documentsDomainService;
            _exploreRepository = exploreRepository;
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

        public async Task<Dictionary<string, PagedResultDto<CourseDto>>> GetByTopicAsync(PagedExploreResultRequestDto input)
        {
            var query = Repository.GetAll()
                //.Where(e => e.Status == CourseStatus.Published)
                .Where(e => e.IsVisible)
                //.WhereIf(input.MovingDate.HasValue && input.StartDate.HasValue, v => v.CreationTime < input.MovingDate.Value && v.CreationTime >= input.StartDate.Value) // For next page of latest month
                //.WhereIf(input.MovingDate.HasValue && !input.StartDate.HasValue && !input.EndDate.HasValue, v => v.CreationTime < input.MovingDate.Value)
                ;
            var totalCount = await query.CountAsync();
            var courses = await query
                .Include(e => e.ImageDocument)
                .Include(e => e.CreatorUser)
                .Include(e => e.StudentCourses)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();

            var courseSections = await _sectionRepository.GetAll()
                   .Where(cs => courses.Select(x => x.Id).Contains(cs.CourseId))
                   .ToListAsync();

            var studentCourses = await _studentCourseRepository.GetAll()
                .Where(x => x.CreatorUserId == AbpSession.GetUserId())
                .ToListAsync();

            foreach (var course in courses)
            {
                if (course.ImageDocumentId.HasValue)
                    course.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocumentId.Value);
                if (course.CreatorUser.ProfilePictureDocumentId.HasValue)
                    course.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(course.CreatorUser.ProfilePictureDocumentId.Value);

                course.Modules = courseSections.Where(x => x.Type == CourseSectionType.Module).Count();
                course.Lessons = courseSections.Where(x => x.Type == CourseSectionType.Lesson).Count();
                course.Units = courseSections.Where(x => x.Type == CourseSectionType.Unit).Count();

                if (studentCourses.Any(x => x.CourseId == course.Id))
                    course.Progress = studentCourses.FirstOrDefault(x => x.CourseId == course.Id).Progress;
            }

            return courses.GroupByTopicsPagedExt();
        }

        public async Task<Dictionary<string, PagedResultDto<CourseDto>>> GetByDatesAsync(PagedExploreResultRequestDto input)
        {
            var query = Repository.GetAll()
                //.Where(e => e.Status == CourseStatus.Published)
                .Where(e => e.IsVisible)
                .WhereIf(input.MovingDate.HasValue && input.StartDate.HasValue, v => v.CreationTime < input.MovingDate.Value && v.CreationTime >= input.StartDate.Value) // For next page of latest month
                .WhereIf(input.MovingDate.HasValue && !input.StartDate.HasValue && !input.EndDate.HasValue, v => v.CreationTime < input.MovingDate.Value)
                ;
            var totalCount = await query.CountAsync();
            var courses = await query
                .Include(e => e.ImageDocument)
                .Include(e => e.CreatorUser)
                .Include(e => e.StudentCourses)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();

            var courseSections = await _sectionRepository.GetAll()
                   .Where(cs => courses.Select(x => x.Id).Contains(cs.CourseId))
                   .ToListAsync();

            var studentCourses = await _studentCourseRepository.GetAll()
                .Where(x => x.CreatorUserId == AbpSession.GetUserId())
                .ToListAsync();

            foreach (var course in courses)
            {
                if (course.ImageDocumentId.HasValue)
                    course.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocumentId.Value);
                if (course.CreatorUser.ProfilePictureDocumentId.HasValue)
                    course.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(course.CreatorUser.ProfilePictureDocumentId.Value);

                course.Modules = courseSections.Where(x => x.Type == CourseSectionType.Module).Count();
                course.Lessons = courseSections.Where(x => x.Type == CourseSectionType.Lesson).Count();
                course.Units = courseSections.Where(x => x.Type == CourseSectionType.Unit).Count();

                if (studentCourses.Any(x => x.CourseId == course.Id))
                    course.Progress = studentCourses.FirstOrDefault(x => x.CourseId == course.Id).Progress;
            }

            return courses.GroupByDateRangePagedExt(input.Grain, input.MaxResultCount);
        }

        public async Task<Dictionary<string, PagedResultDto<CourseDto>>> GetByPopularityAsync(PagedPopularRequestDto input)
        {
            var popularCourses = (await _exploreRepository.GetPopularCourses(input.SkipCount, input.MaxResultCount, input.UserIdFilter))
                    .Select(e => ObjectMapper.Map<CourseDto>(e))
                    .ToList();

            var courseSections = await _sectionRepository.GetAll()
                   .Where(cs => popularCourses.Select(x => x.Id).Contains(cs.CourseId))
                   .ToListAsync();

            var studentCourses = await _studentCourseRepository.GetAll()
                .Where(x => x.CreatorUserId == AbpSession.GetUserId())
                .ToListAsync();

            foreach (var course in popularCourses)
            {
                if (course.ImageDocumentId.HasValue)
                    course.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocumentId.Value);
                if (course.CreatorUser.ProfilePictureDocumentId.HasValue)
                    course.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(course.CreatorUser.ProfilePictureDocumentId.Value);

                course.Modules = courseSections.Where(x => x.Type == CourseSectionType.Module).Count();
                course.Lessons = courseSections.Where(x => x.Type == CourseSectionType.Lesson).Count();
                course.Units = courseSections.Where(x => x.Type == CourseSectionType.Unit).Count();

                if (studentCourses.Any(x => x.CourseId == course.Id))
                    course.Progress = studentCourses.FirstOrDefault(x => x.CourseId == course.Id).Progress;
            }

            return popularCourses.GroupByPopularityPagedExt(input.MaxResultCount);
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
