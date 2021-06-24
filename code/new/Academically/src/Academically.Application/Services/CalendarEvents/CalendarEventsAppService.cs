using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.Timing.Timezone;
using Abp.UI;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Emails;
using Academically.Services.CalendarEvents.Dto;
using Academically.Services.Projects.Dto;
using Microsoft.EntityFrameworkCore;
using SourceCloud.Core.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Academically.Services.CalendarEvents
{
    public class CalendarEventsAppService : AcademicallyAppServiceBase, ICalendarEventsAppService
    {
        private readonly IRepository<CalendarEvent, Guid> _calendarEventsRepository;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IRepository<RescheduleComment, Guid> _rescheduleCommentsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly EmailTemplateHelper _emailTemplateHelper;

        public CalendarEventsAppService(
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            IRepository<Project, Guid> projectsRepository,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<RescheduleComment, Guid> reschedleCommentsRepository,
            IRepository<User, long> usersRepository,
            IDocumentsDomainService documentsDomainService,
            ISettingManager settingManager,
            IEmailService emailService,
            EmailTemplateHelper emailTemplateHelper
            )
        {
            _calendarEventsRepository = calendarEventsRepository;
            _projectsRepository = projectsRepository;
            _projectOffersRepository = projectOffersRepository;
            _rescheduleCommentsRepository = reschedleCommentsRepository;
            _usersRepository = usersRepository;
            _documentsDomainService = documentsDomainService;
            _settingManager = settingManager;
            _emailService = emailService;
            _emailTemplateHelper = emailTemplateHelper;
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
            User tutor = new User();
            if (input.Type != CalendarEventType.Blocker)
            {
                tutor = await UserManager.GetUserByIdAsync(input.TutorId);
                var hasTutorOffer = await _projectOffersRepository.GetAll()
                    .Where(e => e.ProjectId == input.ProjectId && e.CreatorUserId == input.TutorId)
                    .AnyAsync();

                if (!hasTutorOffer)
                {
                    var project = await _projectsRepository.GetAsync(input.ProjectId.Value);
                    throw new UserFriendlyException(L("BookingFailed"), L("NoProjectOfferBookingDomainErrorMessage", tutor.FullName, project.Name));
                }
            }

            input.CreatorUserId = AbpSession.UserId.Value;
            var calendarEvent = ObjectMapper.Map<CalendarEvent>(input);
            await _calendarEventsRepository.InsertAsync(calendarEvent);

            switch (input.Type)
            {
                case CalendarEventType.ConfirmedBooking:
                    break;
                case CalendarEventType.BookingRequest:
                    await SendBookingRequestEmail(calendarEvent, tutor);
                    break;
                case CalendarEventType.RescheduledBooking:
                    break;
            }
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

        public async Task Accept(Guid id, long tutorId)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(id);
            calendarEvent.Type = CalendarEventType.ConfirmedBooking;
            await _calendarEventsRepository.UpdateAsync(calendarEvent);

            var tutor = await UserManager.GetUserByIdAsync(tutorId);
            var student = await _usersRepository.GetAll()
                .Include(e => e.ProfilePictureDocument)
                .Include(e => e.UserEducations)
                    .ThenInclude(e => e.University)
                .FirstOrDefaultAsync(e => e.Id == calendarEvent.CreatorUserId.Value);
            await SendBookingConfirmedEmail(calendarEvent, tutor, student, student);
            await SendBookingConfirmedEmail(calendarEvent, student, tutor, student);
        }

        public async Task Decline(RescheduleCalendarEventDto input)
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

        private async Task SendBookingRequestEmail(CalendarEvent calendarEvent, User tutor)
        {
            var student = await _usersRepository.GetAll()
                .Include(e => e.ProfilePictureDocument)
                .Include(e => e.UserEducations)
                    .ThenInclude(e => e.University)
                .FirstOrDefaultAsync(e => e.Id == AbpSession.UserId.Value);

            string universityName;
            if (student.UserEducations != null && student.UserEducations.Any())
            {
                universityName = student.UserEducations
                    .OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                   .FirstOrDefault()
                   .University.HeProvider;
            }
            else
            {
                universityName = L("NoEducation");
            }

            var timeZone = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);
            var startTime = TimezoneHelper.ConvertFromUtc(calendarEvent.StartTime, timeZone).Value;
            var endTime = TimezoneHelper.ConvertFromUtc(calendarEvent.EndTime, timeZone).Value;
            var minuteDiff = endTime.Subtract(startTime).TotalMinutes;
            var minute = minuteDiff % 60;
            int hour = (int)Math.Floor(minuteDiff / 60);
            string hourText = hour > 1 ? "Hours" : "Hour";
            string minuteText = minute > 1 ? "Minutes" : "Minute";
            string durationText = "";
            if (hour > 0)
            {
                durationText = minute == 0 ? $"{hour} {hourText}" : $"{hour} {hourText} and {minute} {minuteText}";
            }
            else
            {
                durationText = $"{minute} {minuteText}";
            }

            string clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            string studentProfilePicture = student.ProfilePictureDocument != null
                ? await _documentsDomainService.GetFileUrlAsync(student.ProfilePictureDocument)
                : $"{clientRootAddress}/assets/img/anonymous.png";
            string viewDetailsLink = $"{clientRootAddress}/app/calendar?goto={HttpUtility.UrlEncode(calendarEvent.StartTime.ToString("o", CultureInfo.InvariantCulture))}" +
                $"&event-id={calendarEvent.Id}";
            string confirmLink = viewDetailsLink + "&auto-accept=true";

            string emailBody = await _emailTemplateHelper.GetTemplate("booking-request.html", new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("eventName", calendarEvent.Title),
                    new KeyValuePair<string, string>("studentName", student.FullName),
                    new KeyValuePair<string, string>("tutorName", tutor.FullName),
                    new KeyValuePair<string, string>("universityName", universityName),
                    new KeyValuePair<string, string>("startDate", startTime.ToString("dd/MM/yyyy")),
                    new KeyValuePair<string, string>("startTime", startTime.ToString("h:mm tt")),
                    new KeyValuePair<string, string>("duration", durationText),
                    new KeyValuePair<string, string>("timeZone", timeZone),
                    new KeyValuePair<string, string>("year", Clock.Now.Year.ToString()),
                    new KeyValuePair<string, string>("studentProfilePicture", studentProfilePicture),
                    new KeyValuePair<string, string>("confirmLink", confirmLink),
                    new KeyValuePair<string, string>("viewDetailsLink", viewDetailsLink),
                });
            await _emailService.SendAsync(tutor.Name, tutor.EmailAddress, L("BookingRequestEmailSubject"), emailBody);
        }

        private async Task SendBookingConfirmedEmail(CalendarEvent calendarEvent, User attendee, User recipient, User student)
        {
            long tutorId = attendee.Id == student.Id ? recipient.Id : attendee.Id;
            string universityName;
            if (student.UserEducations != null && student.UserEducations.Any())
            {
                universityName = student.UserEducations
                    .OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                   .FirstOrDefault()
                   .University.HeProvider;
            }
            else
            {
                universityName = L("NoEducation");
            }

            var timeZone = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);
            var startTime = TimezoneHelper.ConvertFromUtc(calendarEvent.StartTime, timeZone).Value;
            var endTime = TimezoneHelper.ConvertFromUtc(calendarEvent.EndTime, timeZone).Value;
            var minuteDiff = endTime.Subtract(startTime).TotalMinutes;
            var minute = minuteDiff % 60;
            int hour = (int)Math.Floor(minuteDiff / 60);
            string hourText = hour > 1 ? "Hours" : "Hour";
            string minuteText = minute > 1 ? "Minutes" : "Minute";
            string durationText = "";
            if (hour > 0)
            {
                durationText = minute == 0 ? $"{hour} {hourText}" : $"{hour} {hourText} and {minute} {minuteText}";
            }
            else
            {
                durationText = $"{minute} {minuteText}";
            }

            string clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            string studentProfilePicture = student.ProfilePictureDocument != null
                ? await _documentsDomainService.GetFileUrlAsync(student.ProfilePictureDocument)
                : $"{clientRootAddress}/assets/img/anonymous.png";
            string viewDetailsLink = $"{clientRootAddress}/app/calendar/{tutorId}?goto={HttpUtility.UrlEncode(calendarEvent.StartTime.ToString("o", CultureInfo.InvariantCulture))}" +
                $"&event-id={calendarEvent.Id}";
            string joinSessionLink = "javascript:;";

            string emailBody = await _emailTemplateHelper.GetTemplate("booking-confirmed.html", new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("eventName", calendarEvent.Title),
                    new KeyValuePair<string, string>("attendeeName", attendee.FullName),
                    new KeyValuePair<string, string>("recipientName", recipient.FullName),
                    new KeyValuePair<string, string>("studentName", student.FullName),
                    new KeyValuePair<string, string>("universityName", universityName),
                    new KeyValuePair<string, string>("startDate", startTime.ToString("dd/MM/yyyy")),
                    new KeyValuePair<string, string>("startTime", startTime.ToString("h:mm tt")),
                    new KeyValuePair<string, string>("duration", durationText),
                    new KeyValuePair<string, string>("timeZone", timeZone),
                    new KeyValuePair<string, string>("year", Clock.Now.Year.ToString()),
                    new KeyValuePair<string, string>("studentProfilePicture", studentProfilePicture),
                    new KeyValuePair<string, string>("joinSessionLink", joinSessionLink),
                    new KeyValuePair<string, string>("viewDetailsLink", viewDetailsLink),
                });
            await _emailService.SendAsync(recipient.Name, recipient.EmailAddress, L("BookingConfirmedEmailSubject"), emailBody);
        }

        public async Task CreateBatch(CalendarEventDto[] inputs)
        {
            foreach(var input in inputs)
            {
                input.CreatorUserId = AbpSession.UserId.Value;
                var calendarEvent = ObjectMapper.Map<CalendarEvent>(input);
                await _calendarEventsRepository.InsertAsync(calendarEvent);
            }
        }
    }
}
