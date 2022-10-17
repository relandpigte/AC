using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Linq.Expressions;
using Abp.Linq.Extensions;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Events.Dto;
using Academically.Services.Videos.Dto;
using Academically.Services.Workshops.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.EventsWorkshops
{
    public class EventsWorkshopsAppService: AcademicallyAppServiceBase, IEventsWorkshopsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IRepository<StudentEvent, Guid> _studentEventsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<EventPresenter, Guid> _eventPresentersRepository;
        private readonly ISettingManager _settingManager;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<EventPoll, Guid> _eventPollRepository;
        private readonly IRepository<EventResource, Guid> _eventResourceRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<WorkshopPresenter, Guid> _workshopPresentersRepository;
        private readonly IRepository<Workshop, Guid> _workshopRepository;


        public EventsWorkshopsAppService(
            RoleManager roleManager,
            UserRegistrationManager userRegistrationManager,
            IRepository<StudentEvent, Guid> studentEventsRepository,
            IRepository<User, long> usersRepository,
            IRepository<EventPresenter, Guid> eventPresentersRepository,
            ISettingManager settingManager,
            IRepository<Event, Guid> eventRepository,
            IRepository<EventPoll, Guid> eventPollRepository,
            IRepository<EventResource, Guid> eventResourceRepository,
            IDocumentsDomainService documentsDomainService,
            IRepository<WorkshopPresenter, Guid> workshopPresentersRepository,
            IRepository<Workshop, Guid> workshopRepository


        )
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;

            _roleManager = roleManager;
            _userRegistrationManager = userRegistrationManager;
            _studentEventsRepository = studentEventsRepository;
            _eventPresentersRepository = eventPresentersRepository;
            _usersRepository = usersRepository;
            _settingManager = settingManager;
            _eventRepository = eventRepository;
            _eventPollRepository = eventPollRepository;
            _eventResourceRepository = eventResourceRepository;
            _documentsDomainService = documentsDomainService;
            _workshopPresentersRepository = workshopPresentersRepository;
            _workshopRepository = workshopRepository;
        }

        public async Task<PagedResultDto<Object>> GetAll(PagedEventResultRequestDto input)
        {
            var eventsQuery = _eventRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter)
                .WhereIf(input.Visible.HasValue, e => e.Visible == input.Visible.Value)
                .WhereIf(input.Open.HasValue, e => e.Opened == input.Open.Value)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower()) || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StatusFilter.HasValue, e => e.Status == input.StatusFilter.Value);
            var eventTotalCount = await eventsQuery.CountAsync();
            var events = await eventsQuery.OrderBy(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Include(e => e.CreatorUser)
                .Select(e => ObjectMapper.Map<EventDto>(e))
                .ToListAsync();

            foreach (var ev in events)
            {
                if (ev.ThumbnailDocumentId.HasValue)
                    ev.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(ev.ThumbnailDocumentId.Value);
                if (ev.CreatorUser.ProfilePictureDocumentId.HasValue)
                    ev.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(ev.CreatorUser.ProfilePictureDocumentId.Value);
            }

            var workshopQuery = _workshopRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter)
                .WhereIf(input.Visible.HasValue, e => e.Visible == input.Visible.Value)
                .WhereIf(input.Open.HasValue, e => e.Opened == input.Open.Value)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter),
                    e => e.Name.ToLower().Contains(input.SearchFilter.ToLower()) ||
                         e.Description.ToLower().Contains(input.SearchFilter.ToLower()));
                
            var workshopTotalCount = await workshopQuery.CountAsync();
            var workshops = await workshopQuery.OrderBy(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Select(e => ObjectMapper.Map<WorkshopDto>(e))
                .ToListAsync();

            foreach (var ws in workshops)
            {
                if (ws.ThumbnailDocumentId.HasValue)
                    ws.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(ws.ThumbnailDocumentId.Value);
                if (ws.CreatorUser.ProfilePictureDocumentId.HasValue)
                    ws.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(ws.CreatorUser.ProfilePictureDocumentId.Value);
            }

            var combinedList = events.Cast<Object>()
                .Concat(workshops)
                .ToList();

            return new PagedResultDto<Object>()
            {
                TotalCount = eventTotalCount + workshopTotalCount,
                Items = combinedList
            };
        }
    }

    
}
