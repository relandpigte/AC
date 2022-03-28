using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Events.Dto;
using Academically.Services.Events.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Events
{
    public class EventsAppService : AsyncCrudAppService<Event, EventDto, Guid, PagedEventResultRequestDto, CreateEventDto, UpdateEventDto>, IEventsAppService
    {
        private readonly IRepository<StudentEvent, Guid> _studentEventsRepository;

        public EventsAppService(
            IRepository<StudentEvent, Guid> studentEventsRepository,
            IRepository<Event, Guid> repository
            ) : base(repository)
        {
            _studentEventsRepository = studentEventsRepository;
        }

        protected override IQueryable<Event> CreateFilteredQuery(PagedEventResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.ParentId == input.ParentIdFilter)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StatusFilter.HasValue, e => e.Status == input.StatusFilter.Value);
        }

        protected override IQueryable<Event> ApplyPaging(IQueryable<Event> query, PagedEventResultRequestDto input)
        {
            if (input.ParentIdFilter.HasValue)
            {
                return base.ApplyPaging(query, input)
                    .Include(e => e.ThumbnailDocument);
            }
            else
            {
                return base.ApplyPaging(query, input)
                    .Include(e => e.ThumbnailDocument)
                    .Include(e => e.Children);
            }
        }

        protected override Task<Event> GetEntityByIdAsync(Guid id)
        {
            return Repository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.Parent)
                .Include(e => e.ThumbnailDocument)
                .FirstOrDefaultAsync();
        }

        public async Task<PagedResultDto<EventDto>> GetEventSchedules(PagedEventScheduleResultRequestDto input)
        {
            var query = Repository.GetAll()
                .Where(e => e.Type == EventType.SingleEvent && e.EventDateTime != null)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(input.EventScheduleFilter.HasValue && input.EventScheduleFilter.Value == EventScheduleFilter.Upcoming, e => e.EventDateTime >= Clock.Now)
                .WhereIf(input.EventScheduleFilter.HasValue && input.EventScheduleFilter.Value == EventScheduleFilter.Past, e => e.EventDateTime < Clock.Now)
                .OrderByDescending(e => e.EventDateTime);
            var totalCount = await query.CountAsync();
            var events = await query
                .PageBy(input)
                .Select(e => ObjectMapper.Map<EventDto>(e))
                .ToListAsync();
            return new PagedResultDto<EventDto>(totalCount, events);
        }

        public async Task<PagedResultDto<StudentEventDto>> GetAllPurchasedAsync(PagedStudentEventResultRequestDto input)
        {
            var query = _studentEventsRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId)
                .WhereIf(input.SaveOnlyFilter, e => e.SaveOnly)
                .WhereIf(!input.SaveOnlyFilter, e => !e.SaveOnly);
            var totalCount = await query.CountAsync();
            var studentVideos = await query.PageBy(input)
                .OrderBy(e => e.Event.Name)
                .Include(e => e.Event)
                    .ThenInclude(e => e.ThumbnailDocument)
                .Include(e => e.Event)
                    .ThenInclude(e => e.Children)
                .Select(e => ObjectMapper.Map<StudentEventDto>(e))
                .ToListAsync();
            return new PagedResultDto<StudentEventDto>(totalCount, studentVideos);
        }

        public async Task<StudentEventDto> GetPurchasedAsync(Guid id)
        {
            return await _studentEventsRepository.GetAll()
                .Where(e => !e.SaveOnly && e.CreatorUserId == AbpSession.UserId.Value && e.EventId == id)
                .Select(e => ObjectMapper.Map<StudentEventDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task<GetEventDelayStatusDto> GetDelayStatus(Guid id)
        {
            var query = Repository.GetAll()
                .Where(e => e.ParentId == id)
                .OrderBy(e => e.CreationTime);
            var firstVideo = await query.FirstOrDefaultAsync();
            return new GetEventDelayStatusDto()
            {
                IsFirstVideoPublished = firstVideo?.Status == EventStatus.Published,
                VideoCount = await query.CountAsync(),
            };
        }

        public async Task UpdateStatusAsync(Guid id, EventStatus status)
        {
            var @event = await Repository.GetAsync(id);
            @event.Status = status;
            await Repository.UpdateAsync(@event);
        }

        public async Task<EventDto> UpdateSettingsAsync(UpdateEventSettingsDto input)
        {
            var @event = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, @event);
            await Repository.UpdateAsync(@event);
            return ObjectMapper.Map<EventDto>(@event);
        }

        public async Task PurchaseAsync(CreateStudentEventDto input)
        {
            var studentEvent = ObjectMapper.Map<StudentEvent>(input);
            studentEvent.CreatorUserId = AbpSession.UserId.Value;
            await _studentEventsRepository.InsertAsync(studentEvent);
        }
    }
}
