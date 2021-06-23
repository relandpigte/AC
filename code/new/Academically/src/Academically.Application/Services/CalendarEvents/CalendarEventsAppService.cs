using Abp.Domain.Repositories;
using Abp.UI;
using Academically.Authorization.Roles;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.CalendarEvents.Dto;
using Academically.Services.Projects.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.CalendarEvents
{
    public class CalendarEventsAppService : AcademicallyAppServiceBase, ICalendarEventsAppService
    {
        private readonly IRepository<CalendarEvent, Guid> _calendarEventsRepository;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IRepository<RescheduleComment, Guid> _rescheduleCommentsRepository;

        public CalendarEventsAppService(
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            IRepository<Project, Guid> projectsRepository,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<RescheduleComment, Guid> reschedleCommentsRepository
            )
        {
            _calendarEventsRepository = calendarEventsRepository;
            _projectsRepository = projectsRepository;
            _projectOffersRepository = projectOffersRepository;
            _rescheduleCommentsRepository = reschedleCommentsRepository;
        }

        public async Task<IEnumerable<CalendarEventDto>> GetAll(GetAllCalendarEventsRequestDto input)
        {
            var user = await UserManager.GetUserByIdAsync(input.UserId);
            var userRoles = await UserManager.GetRolesAsync(user);

            List<long?> userIds;
            if (userRoles.Contains(StaticRoleNames.Tenants.Tutor))
            {
                userIds = await _projectOffersRepository.GetAll()
                    .Where(e => e.CreatorUserId == input.UserId)
                    .Select(e => e.Project.CreatorUserId)
                    .ToListAsync();
            }
            else
            {
                userIds = new List<long?>();
            }
            userIds.Add(user.Id);

            var eventsQuery = _calendarEventsRepository.GetAll()
                .Where(e => userIds.Any(id => id == e.CreatorUserId))
                .Include(e => e.Project)
                .Include(e => e.RescheduleComments)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument);

            var oneTimeEvents = await eventsQuery
                .Where(e => e.Recurrence == CalendarEventRecurrence.OneTime
                    && e.StartTime >= input.StartTime
                    && e.EndTime <= input.EndTime)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .ToListAsync();
            var recurringEvents = await eventsQuery
                .Where(e => e.Recurrence != CalendarEventRecurrence.OneTime)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .ToListAsync();

            var calendarEvents = new List<CalendarEventDto>();
            calendarEvents.AddRange(oneTimeEvents);
            calendarEvents.AddRange(recurringEvents);

            return calendarEvents.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime);
        }

        public async Task<IEnumerable<ProjectDto>> GetUserProjects(long userId)
        {
            var projects = await _projectsRepository.GetAll()
                .Where(e => e.CreatorUserId == userId)
                .Select(e => ObjectMapper.Map<ProjectDto>(e))
                .ToListAsync();
            return projects;
        }

        public async Task Create(CalendarEventDto input)
        {
            if (input.Type != CalendarEventType.Blocker)
            {
                var hasTutorOffer = await _projectOffersRepository.GetAll()
                    .Where(e => e.ProjectId == input.ProjectId && e.CreatorUserId == input.TutorId)
                    .AnyAsync();

                if (!hasTutorOffer)
                {
                    var tutor = await UserManager.GetUserByIdAsync(input.TutorId);
                    var project = await _projectsRepository.GetAsync(input.ProjectId.Value);
                    throw new UserFriendlyException(L("BookingFailed"), L("NoProjectOfferBookingDomainErrorMessage", tutor.FullName, project.Name));
                }
            }

            input.CreatorUserId = AbpSession.UserId.Value;
            var calendarEvent = ObjectMapper.Map<CalendarEvent>(input);
            await _calendarEventsRepository.InsertAsync(calendarEvent);
        }

        public async Task Update(CalendarEventDto input)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(input.Id.Value);
            ObjectMapper.Map(input, calendarEvent);
            await _calendarEventsRepository.UpdateAsync(calendarEvent);
        }

        public async Task Reschedule(RescheduleCalendarEventDto input)
        {
            input.CalendarEvent.RescheduleComments = null;
            input.CalendarEvent.Project = null;
            var calendarEvent = await _calendarEventsRepository.GetAsync(input.CalendarEvent.Id.Value);
            ObjectMapper.Map(input.CalendarEvent, calendarEvent);
            calendarEvent.Type = CalendarEventType.RescheduledBooking;
            await _calendarEventsRepository.UpdateAsync(calendarEvent);

            var rescheduleComment = new RescheduleComment();
            rescheduleComment.OldStartTime = input.OldStartTime;
            rescheduleComment.OldEndTime = input.OldEndTime;
            rescheduleComment.NewStartTime = input.CalendarEvent.StartTime;
            rescheduleComment.NewEndTime = input.CalendarEvent.EndTime;
            rescheduleComment.Comments = input.Comments;
            rescheduleComment.CalendarEventId = input.CalendarEvent.Id.Value;
            await _rescheduleCommentsRepository.InsertAsync(rescheduleComment);
        }

        public async Task AcceptOffer(Guid id)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(id);
            calendarEvent.Type = CalendarEventType.ConfirmedBooking;
            await _calendarEventsRepository.UpdateAsync(calendarEvent);
        }

        public async Task DeclineOffer(RescheduleCalendarEventDto input)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(input.CalendarEvent.Id.Value);
            var previousRescheduleComment = await _rescheduleCommentsRepository.GetAll()
                .OrderByDescending(e => e.CreationTime)
                .FirstOrDefaultAsync();

            var rescheduleComment = new RescheduleComment();
            rescheduleComment.OldStartTime = calendarEvent.StartTime;
            rescheduleComment.OldEndTime = calendarEvent.EndTime;

            calendarEvent.Type = CalendarEventType.RescheduledBooking;
            calendarEvent.StartTime = previousRescheduleComment.OldStartTime;
            calendarEvent.EndTime = previousRescheduleComment.OldEndTime;

            rescheduleComment.NewStartTime = calendarEvent.StartTime;
            rescheduleComment.NewEndTime = calendarEvent.EndTime;
            rescheduleComment.Comments = input.Comments;
            rescheduleComment.CalendarEventId = input.CalendarEvent.Id.Value;

            await _rescheduleCommentsRepository.InsertAsync(rescheduleComment);
            await _calendarEventsRepository.UpdateAsync(calendarEvent);
        }
    }
}
