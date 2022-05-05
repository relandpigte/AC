using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Expressions;
using Abp.Linq.Extensions;
using Abp.Timing;
using Abp.UI;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Events.Dto;
using Academically.Services.Events.Enums;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Events
{
    public class EventsAppService : AsyncCrudAppService<Event, EventDto, Guid, PagedEventResultRequestDto, CreateEventDto, UpdateEventDto>, IEventsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<StudentEvent, Guid> _studentEventsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<EventPresenter, Guid> _eventPresentersRepository;

        public EventsAppService(
            RoleManager roleManager,
            IRepository<StudentEvent, Guid> studentEventsRepository,
            IRepository<User, long> usersRepository,
            IRepository<EventPresenter, Guid> eventPresentersRepository,
            IRepository<Event, Guid> repository
            ) : base(repository)
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;

            _roleManager = roleManager;
            _studentEventsRepository = studentEventsRepository;
            _eventPresentersRepository = eventPresentersRepository;
            _usersRepository = usersRepository;
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
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.Children)
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

        public async Task<PagedResultDto<UserDto>> GetPresentersForInvite(PagedPresentersForInviteResultRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var eventPresenterIds = _eventPresentersRepository.GetAll()
                .Where(e => e.EventId == input.EventIdFilter)
                .Select(e => e.UserId);
            var tutorRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Tutor);
            var query = _usersRepository.GetAll()
                .Where(e => e.Id != AbpSession.UserId.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter)
                     || e.Surname.ToLower().Contains(input.SearchFilter))
                .Where(e => e.Roles.Any(r => r.RoleId == tutorRole.Id))
                .Where(e => !eventPresenterIds.Any(id => id == e.Id));
            var totalCount = await query.CountAsync();
            var tutors = await query.PageBy(input)
                .OrderBy(e => e.Name)
                    .ThenBy(e => e.Surname)
                .Include(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<UserDto>(e))
                .ToListAsync();
            return new PagedResultDto<UserDto>(totalCount, tutors);
        }

        public async Task<IEnumerable<EventPresenterDto>> GetAllPresenters(Guid id)
        {
            return await _eventPresentersRepository.GetAll()
                .Where(e => e.EventId == id)
                .OrderBy(e => e.User.Name)
                    .ThenBy(e => e.User.Surname)
                .Include(e => e.User)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<EventPresenterDto>(e))
                .ToListAsync();
        }

        public async Task<IEnumerable<StudentEventDto>> GetAllAudiences(Guid id)
        {
            return await _studentEventsRepository.GetAll()
                .Where(e => e.EventId == id)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .OrderBy(e => e.CreatorUser.Name)
                    .ThenBy(e => e.CreatorUser.Surname)
                .Select(e => ObjectMapper.Map<StudentEventDto>(e))
                .ToListAsync();
        }

        public async Task<IEnumerable<EventDto>> GetAllRelated(Guid id)
        {
            var ev = await Repository.GetAsync(id);
            if (!string.IsNullOrWhiteSpace(ev.Categories))
            {
                var tags = ev.Categories.Split(",").ToList();
                var tagsPredicate = PredicateBuilder.New<Event>();
                foreach (var tag in tags)
                {
                    tagsPredicate = tagsPredicate.Or(e => e.Categories.Contains(tag));
                }

                var relatedVideos = await Repository.GetAll()
                    .Where(e => e.Id != ev.Id)
                    .Where(tagsPredicate)
                    .Include(e => e.ThumbnailDocument)
                    .OrderBy(e => e.Name)
                    .Select(e => ObjectMapper.Map<EventDto>(e))
                    .ToListAsync();
                return relatedVideos;
            }
            return new List<EventDto>();
        }

        public async Task<StudentEventDto> GetPurchasedAsync(Guid id)
        {
            return await _studentEventsRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value && e.EventId == id)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
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

        public async Task InvitePresenterAsync(CreateEventPresenterDto input)
        {
            var eventPresenter = ObjectMapper.Map<EventPresenter>(input);

            var user = await _usersRepository.GetAll()
                .FirstOrDefaultAsync(e => e.EmailAddress.ToLower() == input.Email.ToLower());
            if (user != null)
            {
                eventPresenter.UserId = user.Id;
            }

            eventPresenter.Status = EventPresenterStatus.Invited;
            await _eventPresentersRepository.InsertAsync(eventPresenter);
        }

        public async Task UpdatePresenterTypeAsync(UpdatePresenterTypeDto input)
        {
            var eventPresenter = await _eventPresentersRepository.GetAsync(input.Id);
            eventPresenter.Type = input.NewType;
            await _eventPresentersRepository.UpdateAsync(eventPresenter);
        }

        public async Task UpdatePresenterStatusAsync(UpdateEventPresenterStatusDto input)
        {
            var eventPresenter = await _eventPresentersRepository.GetAll()
                .FirstOrDefaultAsync(e => e.Id == input.Id);
            if (eventPresenter == null)
            {
                throw new UserFriendlyException(101, L("InvitationNotFoundErrorMessage"));
            }
            switch (eventPresenter.Status)
            {
                case EventPresenterStatus.Accepted:
                    throw new UserFriendlyException(102, L("InvitationAlreadyAcceptedErrorMessage"));
                case EventPresenterStatus.Rejected:
                    throw new UserFriendlyException(103, L("InvitationAlreadyRejectedErrorMessage"));
            }
            eventPresenter.Status = input.Status;
            await _eventPresentersRepository.UpdateAsync(eventPresenter);
        }

        public async Task RemovePresenterAsync(Guid eventPresenterId)
        {
            await _eventPresentersRepository.DeleteAsync(eventPresenterId);
        }

        public async Task UnsaveAsync(Guid studentEventId)
        {
            await _studentEventsRepository.DeleteAsync(studentEventId);
        }
    }
}
