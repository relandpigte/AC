using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Expressions;
using Abp.Linq.Extensions;
using Abp.Timing;
using Abp.UI;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Domain.Views;
using Academically.EntityFrameworkCore.Repositories.Explore;
using Academically.Extensions;
using Academically.Services.Events.Dto;
using Academically.Services.Events.Enums;
using Academically.Services.Explore.Dto;
using Academically.Services.Posts.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Academically.Services.Events
{
    public class EventsAppService : AsyncCrudAppService<Event, EventDto, Guid, PagedEventResultRequestDto, CreateEventDto, UpdateEventDto>, IEventsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IRepository<StudentEvent, Guid> _studentEventsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<EventPresenter, Guid> _eventPresentersRepository;
        private readonly ISettingManager _settingManager;
        private readonly IRepository<EventPoll, Guid> _eventPollRepository;
        private readonly IRepository<EventResource, Guid> _eventResourceRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IExploreRepository _exploreRepository;

        public EventsAppService(
            RoleManager roleManager,
            UserRegistrationManager userRegistrationManager,
            IRepository<StudentEvent, Guid> studentEventsRepository,
            IRepository<User, long> usersRepository,
            IRepository<EventPresenter, Guid> eventPresentersRepository,
            ISettingManager settingManager,
            IRepository<Event, Guid> repository,
            IRepository<EventPoll, Guid> eventPollRepository,
            IRepository<EventResource, Guid> eventResourceRepository,
            IDocumentsDomainService documentsDomainService,
            IExploreRepository exploreRepository
            ) : base(repository)
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;

            _roleManager = roleManager;
            _userRegistrationManager = userRegistrationManager;
            _studentEventsRepository = studentEventsRepository;
            _eventPresentersRepository = eventPresentersRepository;
            _usersRepository = usersRepository;
            _settingManager = settingManager;
            _eventPollRepository = eventPollRepository;
            _eventResourceRepository = eventResourceRepository;
            _documentsDomainService = documentsDomainService;
            _exploreRepository = exploreRepository;
        }

        protected override IQueryable<Event> CreateFilteredQuery(PagedEventResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.ParentId == input.ParentIdFilter)
                .WhereIf(input.Visible.HasValue, e => e.Visible == input.Visible.Value)
                .WhereIf(input.Open.HasValue, e => e.Opened == input.Open.Value)
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

        public async Task<Dictionary<string, PagedResultDto<EventDto>>> GetByTopicsAsync(PagedExploreGroupByTopicResultRequestDto input)
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
                    .Where(e => e.Visible.Value)
                    .Select(x => x.Categories).ToListAsync();
                allTopicsInString = string.Join(",", topics.ToArray());
                distinctTopics = allTopicsInString.Split(",").OrderBy(x => x).Distinct();
            }

            // Loop on all topics
            var result = new Dictionary<string, PagedResultDto<EventDto>>();
            foreach (var topic in distinctTopics)
            {
                var query = Repository.GetAll()
                    .Where(e => e.ParentId == null)
                    .Where(c => c.Categories.Contains(topic));
                var totalCount = await query.CountAsync();
                var events = await query
                    .PageBy(input)
                    .Include(e => e.Children)
                    .Include(e => e.ThumbnailDocument)
                    .Include(e => e.CreatorUser)
                    .OrderByDescending(v => v.CreationTime)
                    .Select(e => ObjectMapper.Map<EventDto>(e))
                    .ToListAsync();

                result.Add(topic, new PagedResultDto<EventDto>(totalCount, (await GetEventDetailsAsync(events))));

            }

            return result;
        }

        public async Task<Dictionary<string, PagedResultDto<EventDto>>> GetByDatesAsync(PagedExploreGroupByDateResultRequestDto input)
        {
            var query = Repository.GetAll()
                .Where(e => e.ParentId == null)
                .Where(e => e.Status == EventStatus.Published)
                .WhereIf(input.MovingDate.HasValue && input.StartDate.HasValue, v => v.CreationTime < input.MovingDate.Value && v.CreationTime >= input.StartDate.Value) // For next page of latest month
                .WhereIf(input.MovingDate.HasValue && !input.StartDate.HasValue && !input.EndDate.HasValue, v => v.CreationTime < input.MovingDate.Value);
            var totalCount = await query.CountAsync();
            var events = await query.Include(e => e.Children)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<EventDto>(e))
                .ToListAsync();

            return (await GetEventDetailsAsync(events)).GroupByDateRangePagedExt(input.Grain.Value, input.MaxResultCount);
        }

        public async Task<Dictionary<string, PagedResultDto<EventDto>>> GetByPopularityAsync(PagedPopularRequestDto input)
        {
            var topEventsQuery = _studentEventsRepository.GetAll()
                .Include(x => x.Event)
                .Where(x => x.Event.Visible.Value)
                .Where(e => e.Event.ParentId == null)
                .Where(e => e.Event.Status == EventStatus.Published)
                .Select(x => new
                    {
                        x.EventId,
                        Point = x.SaveOnly ? 1 : 5
                    })
                .GroupBy(x => new { x.EventId })
                .Select(g => new { g.Key.EventId, Popularity = g.Sum(s => s.Point) })
                .OrderByDescending(x => x.Popularity);

            var totalCount = topEventsQuery.Count();

            var topEvents = await topEventsQuery.PageBy(input)
                .Join(Repository.GetAll().Include(e => e.ThumbnailDocument).Include(e => e.CreatorUser),
                        outer => outer.EventId,
                        inner => inner.Id,
                        (inner, outer) => new EventPopularityViewModel(outer, inner.Popularity))
                .Select(e => ObjectMapper.Map<EventDto>(e))
                .ToListAsync();

            return (await GetEventDetailsAsync(topEvents)).GroupByPopularityPagedExt(totalCount);
        }

        private async Task<List<EventDto>> GetEventDetailsAsync(List<EventDto> popularEvents)
        {
            foreach (var vid in popularEvents)
            {
                if (vid.ThumbnailDocumentId.HasValue)
                    vid.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(vid.ThumbnailDocumentId.Value);
                if (vid.CreatorUser.ProfilePictureDocumentId.HasValue)
                    vid.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(vid.CreatorUser.ProfilePictureDocumentId.Value);
            }
            return popularEvents;
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

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetAllEvents()
        {
            return await Repository.GetAll()
                             .AsNoTracking()
                             .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                             .ToListAsync();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetEventsByKeyword(string keyword)
        {
            return await Repository.GetAll()
                             .WhereIf(!keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(keyword) || x.Description.Contains(keyword) || x.Categories.Contains(keyword)
                                      || x.Id.ToString().Equals(keyword))
                             .AsNoTracking()
                             .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                             .ToListAsync();
        }

        public async Task<PagedResultDto<EventDto>> GetEventSchedules(PagedEventScheduleResultRequestDto input)
        {
            var query = Repository.GetAll()
                .Where(e => e.Type == EventType.SingleEvent && e.EventDateTime != null)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(input.EventScheduleFilter.HasValue && input.EventScheduleFilter.Value == EventScheduleFilter.Upcoming, e => e.EventDateTime >= Clock.Now)
                .WhereIf(input.EventScheduleFilter.HasValue && input.EventScheduleFilter.Value == EventScheduleFilter.Past, e => e.EventDateTime < Clock.Now)
                .OrderByDescending(e => e.EventDateTime)
                .Concat(
                    _eventPresentersRepository.GetAll()
                    .Where(e => e.UserId == AbpSession.UserId.Value)
                    .Select(e => e.Event)
                );

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

        public async Task<PagedResultDto<EventInstanceDto>> GetAllEventInstances(PagedEventInstanceResultRequestDto input)
        {
            var @event = await Repository.GetAsync(input.EventIdFilter);
            var eventInstances = new List<EventInstanceDto>();
            if (@event.EventDateTime.HasValue && @event.EndDate.HasValue)
            {
                if (@event.FrequencyType.HasValue)
                {
                    if (@event.FrequencyType.Value == EventFrequencyType.Recurring && @event.TimesPerDay.HasValue && @event.TimesPerDay.Value > 0
                        && !string.IsNullOrWhiteSpace(@event.SessionTimes))
                    {
                        var tempDate = @event.EventDateTime.Value;
                        var sessionTimes = JsonConvert.DeserializeObject<string[]>(@event.SessionTimes);
                        if (sessionTimes != null && sessionTimes.Any())
                        {
                            switch (@event.RecursionType)
                            {
                                case EventRecursionType.Daily:
                                    while (tempDate < @event.EndDate.Value)
                                    {
                                        foreach (var sessionTime in sessionTimes)
                                        {
                                            eventInstances.Add(new EventInstanceDto()
                                            {
                                                Date = tempDate,
                                                Duration = @event.Duration ?? 0,
                                                Id = @event.Id,
                                                Registrants = 0,
                                                Time = sessionTime,
                                            });
                                        }

                                        tempDate = tempDate.AddDays(1);
                                    }
                                    break;
                                case EventRecursionType.Weekly:
                                    if (!string.IsNullOrWhiteSpace(@event.SessionDaysOfWeek))
                                    {
                                        var sessionDaysOfWeek = JsonConvert.DeserializeObject<DayOfWeek[]>(@event.SessionDaysOfWeek);
                                        if (sessionDaysOfWeek != null && sessionDaysOfWeek.Any())
                                        {
                                            while (tempDate < @event.EndDate.Value)
                                            {
                                                if (sessionDaysOfWeek.Contains(tempDate.DayOfWeek))
                                                {
                                                    foreach (var sessionTime in sessionTimes)
                                                    {
                                                        eventInstances.Add(new EventInstanceDto()
                                                        {
                                                            Date = tempDate,
                                                            Duration = @event.Duration ?? 0,
                                                            Id = @event.Id,
                                                            Registrants = 0,
                                                            Time = sessionTime,
                                                        });
                                                    }
                                                }

                                                tempDate = tempDate.AddDays(1);
                                            }
                                        }
                                    }
                                    break;
                                case EventRecursionType.Monthly:
                                    if (!string.IsNullOrWhiteSpace(@event.SessionDaysOfMonth))
                                    {
                                        var sessionDaysOfMonth = JsonConvert.DeserializeObject<int[]>(@event.SessionDaysOfMonth);
                                        if (sessionDaysOfMonth != null && sessionDaysOfMonth.Any())
                                        {
                                            while (tempDate < @event.EndDate.Value)
                                            {
                                                if (sessionDaysOfMonth.Contains(tempDate.Day))
                                                {
                                                    foreach (var sessionTime in sessionTimes)
                                                    {
                                                        eventInstances.Add(new EventInstanceDto()
                                                        {
                                                            Date = tempDate,
                                                            Duration = @event.Duration ?? 0,
                                                            Id = @event.Id,
                                                            Registrants = 0,
                                                            Time = sessionTime,
                                                        });
                                                    }
                                                }

                                                tempDate = tempDate.AddDays(1);
                                            }
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
            }

            var query = eventInstances.AsQueryable()
                .WhereIf(input.PastFilter, e => e.Date < DateTime.UtcNow)
                .WhereIf(!input.PastFilter, e => e.Date >= DateTime.UtcNow);

            var totalCount = query.Count();
            var instances = query
                .PageBy(input)
                .OrderBy(e => e.Date)
                    .ThenBy(e => e.Time)
                .ToList();
            return new PagedResultDto<EventInstanceDto>(totalCount, instances);

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

        public async Task<EventPresenterDto> GetPresenterAsync(Guid id)
        {
            return await _eventPresentersRepository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.User)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<EventPresenterDto>(e))
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
            if (eventPresenter.Status == EventPresenterStatus.Accepted && !eventPresenter.UserId.HasValue)
            {
                var password = await _settingManager.GetSettingValueAsync(AppSettingNames.StaticPasswords_Event);
                var user = await _userRegistrationManager.RegisterAsync(
                    string.Empty,
                    string.Empty,
                    eventPresenter.Email,
                    eventPresenter.Email,
                    password,
                    DateTime.Now,
                    StaticRoleNames.Tenants.EventAttendee
                );
                eventPresenter.UserId = user.Id;
                await _eventPresentersRepository.UpdateAsync(eventPresenter);
            }
            else
            {
                await _eventPresentersRepository.UpdateAsync(eventPresenter);
            }
        }

        public async Task RemovePresenterAsync(Guid eventPresenterId)
        {
            await _eventPresentersRepository.DeleteAsync(eventPresenterId);
        }

        public async Task UnsaveAsync(Guid studentEventId)
        {
            await _studentEventsRepository.DeleteAsync(studentEventId);
        }

        public async Task UpdateAutoAdmit(Guid id, bool autoAdmitAttendees)
        {
            var @event = await Repository.GetAsync(id);
            @event.AutoAdmitAttendees = autoAdmitAttendees;
            await Repository.UpdateAsync(@event);
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            await _eventPollRepository.DeleteAsync(ep => ep.EventId == input.Id);
            await _eventPresentersRepository.DeleteAsync(ep => ep.EventId == input.Id);
            await _eventResourceRepository.DeleteAsync(er => er.EventId == input.Id);
            await _studentEventsRepository.DeleteAsync(se => se.EventId == input.Id);
            await Repository.DeleteAsync(input.Id);
        }
    }
}
