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
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Domain.Views;
using Academically.EntityFrameworkCore.Repositories.Explore;
using Academically.Extensions;
using Academically.Services.Courses.Dto;
using Academically.Services.Explore.Dto;
using Academically.Services.Posts.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace Academically.Services.Courses
{
    [AbpAuthorize(PermissionNames.Pages_Courses, PermissionNames.Pages_Home_Courses)]
    public class CoursesAppService : AsyncCrudAppService<Course, CourseDto, Guid, PagedCourseResultRequestDto, CreateCourseDto, CourseDto>, ICoursesAppService
    {
        private readonly IRepository<CourseRating, Guid> _ratingRepository;
        private readonly IRepository<StudentCourse, Guid> _studentCourseRepository;
        private readonly IRepository<CourseSection, Guid> _courseSectionRepository;
        private readonly IRepository<StudentCourseSection, Guid> _studentCourseSectionRepository;
        private readonly IRepository<CourseRatingArea, Guid> _courseRatingAreaRepository;
        private readonly IRepository<CourseConversation, Guid> _courseConversationRepository;
        private readonly IRepository<CourseConversationReaction, Guid> _courseConversationReactionRepository;
        private readonly IRepository<SavedService, Guid> _savedServiceRepository;
        private readonly IRepository<ServicePurchase, Guid> _servicePurchasesRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IExploreRepository _exploreRepository;
        private readonly IRepository<ServiceRating, Guid> _serviceRatingRepository;

        public CoursesAppService(
            IRepository<Course, Guid> coursesRepository,
            IRepository<CourseRating, Guid> ratingRepository,
            IRepository<StudentCourse, Guid> studentCourseRepository,
            IRepository<CourseSection, Guid> courseSectionRepository,
            IRepository<StudentCourseSection, Guid> studentCourseSectionRepository,
            IRepository<CourseRatingArea, Guid> courseRatingAreaRepository,
            IRepository<CourseConversation, Guid> courseConversationRepository,
            IRepository<CourseConversationReaction, Guid> courseConversationReactionRepository,
            IRepository<SavedService, Guid> savedServiceRepository,
            IRepository<ServicePurchase, Guid> servicePurchasesRepository,
            IDocumentsDomainService documentsDomainService,
            IExploreRepository exploreRepository,
            IRepository<ServiceRating, Guid> serviceRatingRepository
            ) : base(coursesRepository)
        {
            _ratingRepository = ratingRepository;
            _studentCourseRepository = studentCourseRepository;
            _courseSectionRepository = courseSectionRepository;
            _documentsDomainService = documentsDomainService;
            _exploreRepository = exploreRepository;
            _studentCourseSectionRepository = studentCourseSectionRepository;
            _courseRatingAreaRepository = courseRatingAreaRepository;
            _courseConversationRepository = courseConversationRepository;
            _courseConversationReactionRepository = courseConversationReactionRepository;
            _savedServiceRepository = savedServiceRepository;
            _servicePurchasesRepository = servicePurchasesRepository;
            _serviceRatingRepository = serviceRatingRepository;
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
                .Include(c => c.StudentCourses)
                    .ThenInclude(c => c.StudentCourseSections)
                        .ThenInclude(c => c.CourseSection)
                .FirstOrDefaultAsync();
            var output = ObjectMapper.Map<CourseDto>(course);
            var courseSections = await _courseSectionRepository.GetAll()
                .Where(cs => cs.CourseId == output.Id)
                .ToListAsync();
            
            output.CourseImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocument);
            output.Modules = courseSections.Count(x => x.Type == CourseSectionType.Module && output.Id == x.CourseId && x.ParentId == null);
            output.Lessons = courseSections.Count(x => x.Type == CourseSectionType.Lesson && output.Id == x.CourseId && x.ParentId == null);
            output.Units = courseSections.Count(x => x.Type == CourseSectionType.Unit && output.Id == x.CourseId && x.ParentId == null);
            
            var studentCourses = await _studentCourseRepository.GetAll()
                .Where(x => x.CreatorUserId == AbpSession.GetUserId())
                .ToListAsync();
            
            if (studentCourses.Any(x => x.CourseId == course.Id))
                output.Progress = studentCourses.FirstOrDefault(x => x.CourseId == course.Id && x.CreatorUserId == AbpSession.GetUserId())!.Progress;
            
            var servicePurchase = await _servicePurchasesRepository
                .FirstOrDefaultAsync(p => p.ReferenceId.ToString() == output.Id.ToString() && p.CreatorUserId == AbpSession.GetUserId());
            output.IsPurchased = servicePurchase != null;
            
            if (output.CreatorUser.ProfilePictureDocumentId.HasValue)
                output.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(output.CreatorUser.ProfilePictureDocumentId.Value);
            
            var savedService = await _savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == output.Id.ToString());
            output.IsSaved = savedService != null;
            
            var userRating = await _serviceRatingRepository.FirstOrDefaultAsync(r => r.ServiceId == output.Id && r.CreatorUserId == AbpSession.GetUserId());
            output.HasReviewed = userRating != null;
                
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
                    item.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(item.ImageDocumentId.Value);

                var courseSections = await _courseSectionRepository.GetAll()
                    .Where(cs => cs.CourseId == item.Id)
                    .ToListAsync();
                
                item.Modules = courseSections.Count(x => x.Type == CourseSectionType.Module && item.Id == x.CourseId && x.ParentId == null);
                item.Lessons = courseSections.Count(x => x.Type == CourseSectionType.Lesson && item.Id == x.CourseId && x.ParentId == null);
                item.Units = courseSections.Count(x => x.Type == CourseSectionType.Unit && item.Id == x.CourseId && x.ParentId == null);
                item.Enrolled = await _servicePurchasesRepository.GetAll()
                    .Where(c => c.ReferenceId == item.Id)
                    .Select(c => ObjectMapper.Map<UserDto>(c.CreatorUser))
                    .ToListAsync();
                
                foreach (var u in item.Enrolled) if (u.ProfilePictureDocumentId.HasValue) u.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(u.ProfilePictureDocumentId.Value);
            }
            return output;
        }

        public async Task<Dictionary<string, PagedResultDto<CourseDto>>> GetByTopicAsync(PagedExploreGroupByTopicResultRequestDto input)
        {
            var topics = new List<string>();
            string allTopicsInString;
            IEnumerable<string> distinctTopics = new List<string>();

            
            if (!string.IsNullOrEmpty(input.Topic))
            {
                distinctTopics = distinctTopics.Append(input.Topic);
            }
            else
            {
                // Get all topics
                topics = await Repository.GetAll()
                    .Where(x => !string.IsNullOrEmpty(x.Categories))
                    .Where(e => e.IsVisible)
                    .Select(x => x.Categories).ToListAsync();
                allTopicsInString = string.Join(",", topics.ToArray());
                distinctTopics = allTopicsInString.Split(",").OrderBy(x => x).Distinct();
            }

            // Loop on all topics
            var result = new Dictionary<string, PagedResultDto<CourseDto>>();
            foreach (var topic in distinctTopics)
            {
                var query = Repository.GetAll()
                    .Include(e => e.ImageDocument)
                    .Include(e => e.CreatorUser)
                    .Include(e => e.StudentCourses)
                    .Where(e => e.IsVisible)
                    .Where(c => c.Categories.Contains(topic));
                var totalCount = await query.CountAsync();
                var courses = await query
                    .OrderByDescending(v => v.CreationTime)
                    .PageBy(input)
                    .Select(e => ObjectMapper.Map<CourseDto>(e))
                    .ToListAsync();

                result.Add(topic, new PagedResultDto<CourseDto>(totalCount, await GetCoursesDetailsAsync(courses)));
            }

            return result;
        }

        public async Task<Dictionary<string, PagedResultDto<CourseDto>>> GetByDatesAsync(PagedExploreGroupByDateResultRequestDto input)
        {
            var query = Repository.GetAll()
                .Where(e => e.IsVisible && e.Status == CourseStatus.Published)
                .WhereIf(input.MovingDate.HasValue && input.StartDate.HasValue, v => v.CreationTime < input.MovingDate.Value && v.CreationTime >= input.StartDate.Value) // For next page of latest month
                .WhereIf(input.MovingDate.HasValue && !input.StartDate.HasValue && !input.EndDate.HasValue, v => v.CreationTime < input.MovingDate.Value);
            var totalCount = await query.CountAsync();
            var courses = await query
                .Include(e => e.ImageDocument)
                .Include(e => e.CreatorUser)
                .Include(e => e.StudentCourses)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();

            return (await GetCoursesDetailsAsync(courses)).GroupByDateRangePagedExt(input.Grain.Value, input.MaxResultCount);
        }

        public async Task<Dictionary<string, PagedResultDto<CourseDto>>> GetByPopularityAsync(PagedPopularRequestDto input)
        {
            
            var topCoursesQuery = _studentCourseRepository.GetAll()
                .Include(x => x.Course)
                .Where(e => e.Course.IsVisible)
                .Select(x => new
                    {
                        CourseId = x.CourseId,
                        Point = 5
                    })
                .GroupBy(gc => gc.CourseId)
                .Select(g => new { CourseId = g.Key, Popularity = g.Sum(s => s.Point) })
                .OrderByDescending(x => x.Popularity);

            
            var totalCount = topCoursesQuery.Count();

            var topCourses = await topCoursesQuery.PageBy(input)
                .Join(Repository.GetAll().Include(e => e.ImageDocument).Include(e => e.CreatorUser), 
                        outer => outer.CourseId, 
                        inner => inner.Id, 
                        (inner, outer) => new CoursePopularityViewModel(outer, inner.Popularity))
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();

            return (await GetCoursesDetailsAsync(topCourses)).GroupByPopularityPagedExt(totalCount);
        }

        private async Task<List<CourseDto>> GetCoursesDetailsAsync(List<CourseDto> popularCourses)
        {
            var courseSections = await _courseSectionRepository.GetAll()
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

                course.Modules = courseSections.Count(x => x.Type == CourseSectionType.Module && course.Id == x.CourseId && x.ParentId == null);
                course.Lessons = courseSections.Count(x => x.Type == CourseSectionType.Lesson && course.Id == x.CourseId && x.ParentId == null);
                course.Units = courseSections.Count(x => x.Type == CourseSectionType.Unit && course.Id == x.CourseId && x.ParentId == null);

                var userRating = await _serviceRatingRepository.FirstOrDefaultAsync(r => r.ServiceId == course.Id && r.CreatorUserId == AbpSession.GetUserId());
                course.HasReviewed = userRating != null;

                if (studentCourses.Any(x => x.CourseId == course.Id))
                    course.Progress = studentCourses.FirstOrDefault(x => x.CourseId == course.Id)!.Progress;

                var savedService = await _savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == course.Id.ToString());
                course.IsSaved = savedService != null;

                var purchasedService = await _servicePurchasesRepository.FirstOrDefaultAsync(p => p.ReferenceId.ToString() == course.Id.ToString() && p.CreatorUserId == this.AbpSession.UserId);
                course.IsPurchased = purchasedService != null;
            }

            return popularCourses;
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

        public async Task UpdateStatusAsync(Guid id, CourseStatus status)
        {
            var @event = await Repository.GetAsync(id);
            @event.Status = status;
            await Repository.UpdateAsync(@event);
        }

        public async Task<CourseDto> UpdateSettings(UpdateCourseSettingsDto input)
        {
            var course = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, course);
            return ObjectMapper.Map<CourseDto>(await Repository.UpdateAsync(course));
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            var ratings = await _ratingRepository.GetAll()
                .Include(x => x.CourseRatingAreas)
                .Where(c => c.CourseId == input.Id)
                .ToListAsync();
            var courseRatingAreaIds = ratings.SelectMany(x => x.CourseRatingAreas
                .Select(ca => ca.Id)).ToList();
            
            foreach (var crId in courseRatingAreaIds)
            {
                await _courseRatingAreaRepository.DeleteAsync(crId);
            }
            
            await _ratingRepository.DeleteAsync(cr => cr.CourseId == input.Id);

            var studentCourses = await _studentCourseRepository.GetAll()
                .Include(x => x.StudentCourseSections)
                .Include(c => c.StudentCourseConversations)
                .Where(c => c.CourseId == input.Id)
                .ToListAsync();
            var studentCourseSectionIds = studentCourses.SelectMany(x=> x.StudentCourseSections.Select(c => c.Id)).ToList();
            var studentConversationIds = studentCourses.SelectMany(x => x.StudentCourseConversations.Select(c => c.Id)).ToList();

            foreach (var scsId in studentCourseSectionIds)
            {
                await _studentCourseSectionRepository.DeleteAsync(scsId);
            }

            foreach (var scsId in studentConversationIds)
            {
                await _courseConversationReactionRepository.DeleteAsync(x => x.CourseConversationId == scsId);
                await _courseConversationRepository.DeleteAsync(scsId);
            }

            await _studentCourseRepository.DeleteAsync(sc => sc.CourseId == input.Id);
            await _courseSectionRepository.DeleteAsync(cs => cs.CourseId == input.Id);
            await Repository.DeleteAsync(input.Id);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetAllCourses()
        {
            return await Repository.GetAll().Where(w => w.IsVisible && w.Status == CourseStatus.Published)
                                      .AsNoTracking()
                                      .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                                      .ToListAsync();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetCoursesByKeyword(string keyword, long? creatorUserId)
        {
            return await Repository.GetAll().Where(w => w.IsVisible && w.Status == CourseStatus.Published)
                             .WhereIf(!keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(keyword) || x.Description.Contains(keyword) || x.Subtitle.Contains(keyword) || x.Price.ToString().Contains(keyword)
                                      || x.Id.ToString().Equals(keyword))
                             .WhereIf(creatorUserId.HasValue, x => x.CreatorUserId == creatorUserId)
                             .Include(c => c.CreatorUser)
                             .AsNoTracking()
                             .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                             .ToListAsync();
        }

        public async Task<IEnumerable<CourseDto>> GetEnrolledCoursesByUser()
        { 
            var purchases = await _servicePurchasesRepository.GetAll()
                .Where(p => p.Type == ServicesType.Course)
                .Where(p => p.CreatorUserId == AbpSession.GetUserId())
                .Select(p => p.ReferenceId)
                .ToListAsync();

            var courses = await Repository.GetAll()
                .Include(c => c.CreatorUser)
                .Include(c => c.StudentCourses)
                    .ThenInclude(c => c.StudentCourseSections)
                        .ThenInclude(c => c.CourseSection)
                .Where(c => c.IsVisible && c.Status == CourseStatus.Published)
                .Where(c => purchases.Contains(c.Id))
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();

            return await GetCoursesDetailsAsync(courses);
        }
    }
}
