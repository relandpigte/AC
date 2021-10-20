using Abp;
using Abp.Configuration;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Localization;
using Abp.Notifications;
using Abp.Timing;
using Abp.Timing.Timezone;
using Abp.UI;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.CalendarEvents;
using Academically.Domain.Services.Documents;
using Academically.Emails;
using Academically.Notifications;
using Academically.Services.CalendarEvents.Dto;
using Academically.Services.CalendarEvents.Notifications;
using Academically.Services.Projects.Dto;
using Microsoft.EntityFrameworkCore;
using SourceCloud.Core.Services;
using SourceCloud.Core.Services.Email;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
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
        private readonly IRepository<UserCalendarEvent, Guid> _userCalendarEventsRepository;
        private readonly ICalendarEventsDomainService _calendarEventsDomainService;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly INotificationPublisher _notificationPublisher;
        private readonly EmailTemplateHelper _emailTemplateHelper;

        public CalendarEventsAppService(
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            IRepository<Project, Guid> projectsRepository,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<RescheduleComment, Guid> reschedleCommentsRepository,
            IRepository<User, long> usersRepository,
            IRepository<UserCalendarEvent, Guid> userCalendarEventsRepository,
            ICalendarEventsDomainService calendarEventsDomainService,
            IDocumentsDomainService documentsDomainService,
            ISettingManager settingManager,
            IEmailService emailService,
            INotificationPublisher notificationPublisher,
            EmailTemplateHelper emailTemplateHelper
            )
        {
            _calendarEventsRepository = calendarEventsRepository;
            _projectsRepository = projectsRepository;
            _projectOffersRepository = projectOffersRepository;
            _rescheduleCommentsRepository = reschedleCommentsRepository;
            _usersRepository = usersRepository;
            _userCalendarEventsRepository = userCalendarEventsRepository;
            _calendarEventsDomainService = calendarEventsDomainService;
            _documentsDomainService = documentsDomainService;
            _settingManager = settingManager;
            _emailService = emailService;
            _notificationPublisher = notificationPublisher;
            _emailTemplateHelper = emailTemplateHelper;
        }

        public async Task<CalendarEventDto> Get(Guid id)
        {
            var calendarEvent = await _calendarEventsRepository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.UserCalendarEvents)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .FirstOrDefaultAsync();
            return calendarEvent;
        }

        public async Task<CalendarEventDto> GetAllEventDetailsbyEventId(Guid id)
        {
            var calendarEvent = await _calendarEventsRepository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.UserCalendarEvents)
                .Include(e => e.CreatorUser)
                .Include(e => e.Project)
                    .ThenInclude(e => e.CreatorUser)
                .Include(e => e.ProjectOffer)
                    .ThenInclude(e => e.CreatorUser)
                .Include(e => e.RescheduleComments)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .FirstOrDefaultAsync();
            return calendarEvent;
        }

        public async Task<IEnumerable<CalendarEventDto>> GetAll(GetAllCalendarEventsRequestDto input)
        {
            var eventsQuery = _userCalendarEventsRepository.GetAll()
                .Where(e => e.UserId == input.UserId)
                .Where(e => e.CalendarEvent.ProjectId == null || !e.CalendarEvent.Project.IsDeleted)
                .Select(e => e.CalendarEvent)
                .Distinct()
                .Where(e => e.Type != CalendarEventType.Cancelled)
                .Include(e => e.CreatorUser)
                .Include(e => e.Project)
                    .ThenInclude(e => e.CreatorUser)
                .Include(e => e.ProjectOffer)
                    .ThenInclude(e => e.CreatorUser)
                .Include(e => e.RescheduleComments)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument);

            var oneTimeEvents = await eventsQuery
                .Where(e => e.Recurrence == CalendarEventRecurrence.OneTime
                    && e.StartTime >= input.StartTime.AddDays(-7)
                    && e.EndTime <= input.EndTime.AddDays(6))
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

        public async Task<IEnumerable<CalendarEventDto>> GetUpcoming(DateTime currentTime, long userId)
        {
            var eventsQuery = _userCalendarEventsRepository.GetAll()
                .Where(e => e.UserId == userId)
                .Where(e => !e.CalendarEvent.Project.IsDeleted)
                .Select(e => e.CalendarEvent)
                .Distinct()
                .Where(e => e.Type == CalendarEventType.ConfirmedBooking && e.StartTime >= currentTime)
                .Include(e => e.Project)
                .OrderBy(e => e.StartTime)
                .Take(3);

            var oneTimeEvents = await eventsQuery
                .Where(e => e.Recurrence == CalendarEventRecurrence.OneTime)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .ToListAsync();
            var recurringEvents = await eventsQuery
                .Where(e => e.Recurrence != CalendarEventRecurrence.OneTime)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .ToListAsync();

            var calendarEvents = new List<CalendarEventDto>();
            calendarEvents.AddRange(oneTimeEvents);
            calendarEvents.AddRange(recurringEvents);

            return calendarEvents.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime).Take(3);
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
            var userIds = new List<long>();
            var project = await _projectsRepository.GetAsync(input.ProjectId.Value);
            if (input.Type != CalendarEventType.Blocker && input.ProjectId != null)
            {
                tutor = await _usersRepository.GetAll()
                    .Include(e => e.ProfilePictureDocument)
                    .FirstOrDefaultAsync(e => e.Id == input.TutorId);
                var projectOffer = await _projectOffersRepository.GetAll()
                    .Where(e => e.ProjectId == input.ProjectId && e.CreatorUserId == input.TutorId && e.IsAccepted)
                    .FirstOrDefaultAsync();

                if (projectOffer == null)
                {
                    throw new UserFriendlyException(L("BookingFailed"), L("NoProjectOfferBookingDomainErrorMessage", tutor.FullName, project.Name));
                }

                input.ProjectOfferId = projectOffer.Id;
                userIds.Add(tutor.Id);
            }

            input.CreatorUserId = AbpSession.UserId.Value;
            var calendarEvent = ObjectMapper.Map<CalendarEvent>(input);
            userIds.Add(input.CreatorUserId);
            await _calendarEventsDomainService.InsertAsync(calendarEvent, userIds);

            switch (input.Type)
            {
                case CalendarEventType.ConfirmedBooking:
                    break;
                case CalendarEventType.BookingRequest:
                    if (input.ProjectId != null)
                        await SendBookingRequestEmail(calendarEvent, tutor);
                    break;
                case CalendarEventType.RescheduledBooking:
                    break;
            }

            var notificationData = new LocalizableMessageNotificationData(new LocalizableString("NewBookingNotificationMessage", AcademicallyConsts.LocalizationSourceName));
            notificationData["0"] = tutor.FullName;
            notificationData["1"] = calendarEvent.Title;
            notificationData["2"] = project.Name;

            await _notificationPublisher.PublishAsync(
                NotificationNames.Notifications_CalendarEvents_NewBooking,
                notificationData,
                userIds: new[] { new UserIdentifier(tutor.TenantId, tutor.Id) }
            );
        }

        public async Task Update(CalendarEventDto input)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(input.Id.Value);
            ObjectMapper.Map(input, calendarEvent);
            await _calendarEventsDomainService.UpdateAsync(calendarEvent);
        }

        public async Task Reschedule(RescheduleCalendarEventDto input)
        {
            input.CalendarEvent.RescheduleComments = null;
            input.CalendarEvent.Project = null;
            var calendarEvent = await _calendarEventsRepository.GetAsync(input.CalendarEvent.Id.Value);
            ObjectMapper.Map(input.CalendarEvent, calendarEvent);
            calendarEvent.Type = CalendarEventType.RescheduledBooking;
            await _calendarEventsDomainService.UpdateAsync(calendarEvent);

            var rescheduleComment = new RescheduleComment();
            rescheduleComment.OldStartTime = input.OldStartTime;
            rescheduleComment.OldEndTime = input.OldEndTime;
            rescheduleComment.NewStartTime = input.CalendarEvent.StartTime;
            rescheduleComment.NewEndTime = input.CalendarEvent.EndTime;
            rescheduleComment.Comments = input.Comments;
            rescheduleComment.CalendarEventId = input.CalendarEvent.Id.Value;
            rescheduleComment.CreatorUserId = AbpSession.UserId.Value;
            await _rescheduleCommentsRepository.InsertAsync(rescheduleComment);

            var projectOffer = await _projectOffersRepository.GetAll()
                .Where(e => e.Id == calendarEvent.ProjectOfferId.Value)
                .Include(e => e.Project)
                    .ThenInclude(e => e.CreatorUser)
                .Include(e => e.CreatorUser)
                .FirstOrDefaultAsync();

            User currentUser;
            User notificationUser;
            if (projectOffer.CreatorUserId == AbpSession.UserId.Value)
            {
                currentUser = projectOffer.CreatorUser;
                notificationUser = projectOffer.Project.CreatorUser;
            }
            else
            {
                currentUser = projectOffer.Project.CreatorUser;
                notificationUser = projectOffer.CreatorUser;
            }

            var notificationData = new LocalizableMessageNotificationData(new LocalizableString("BookingRescheduledNotificationMessage", AcademicallyConsts.LocalizationSourceName));
            notificationData["0"] = currentUser.FullName;
            notificationData["1"] = calendarEvent.Title;
            notificationData["2"] = projectOffer.Project.Name;

            await _notificationPublisher.PublishAsync(
                NotificationNames.Notifications_CalendarEvents_BookingRescheduled,
                notificationData,
                userIds: new[] { new UserIdentifier(notificationUser.TenantId, notificationUser.Id) }
            );
        }

        public async Task Accept(Guid id, long tutorId)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(id);
            calendarEvent.Type = CalendarEventType.ConfirmedBooking;
            await _calendarEventsDomainService.UpdateAsync(calendarEvent);

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
            await _calendarEventsDomainService.UpdateAsync(calendarEvent);
        }

        public async Task Cancel(RescheduleCalendarEventDto input)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(input.CalendarEvent.Id.Value);
            calendarEvent.Type = CalendarEventType.Cancelled;

            var rescheduleComment = new RescheduleComment();
            rescheduleComment.OldStartTime = calendarEvent.StartTime;
            rescheduleComment.OldEndTime = calendarEvent.EndTime;
            rescheduleComment.NewStartTime = calendarEvent.StartTime;
            rescheduleComment.NewEndTime = calendarEvent.EndTime;
            rescheduleComment.Comments = input.Comments;
            rescheduleComment.CalendarEventId = input.CalendarEvent.Id.Value;

            await _rescheduleCommentsRepository.InsertAsync(rescheduleComment);
            await _calendarEventsDomainService.UpdateAsync(calendarEvent);
        }


        public async Task CreateBatch(CalendarEventDto[] inputs)
        {
            if (inputs != null && inputs.Any())
            {
                var projectOffer = await _projectOffersRepository.GetAsync(inputs.FirstOrDefault().ProjectOfferId.Value);
                foreach (var input in inputs)
                {
                    input.CreatorUserId = AbpSession.UserId.Value;
                    var calendarEvent = ObjectMapper.Map<CalendarEvent>(input);
                    await _calendarEventsDomainService.InsertAsync(calendarEvent, new List<long>()
                    {
                        input.CreatorUserId,
                        projectOffer.CreatorUserId.Value,
                    });
                }
            }
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

            string tutorEmailBody = await _emailTemplateHelper.GetTemplate("booking-request.html", new List<KeyValuePair<string, string>>
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

            await _emailService.SendAsync(tutor.Name, tutor.EmailAddress, L("BookingRequestEmailSubject"), tutorEmailBody);

            string studentEmailBody = await _emailTemplateHelper.GetTemplate("booking-requested.html", new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("tutorName", tutor.FullName),
                    new KeyValuePair<string, string>("studentName", student.FullName),
                    new KeyValuePair<string, string>("universityName", universityName),
                    new KeyValuePair<string, string>("eventName", calendarEvent.Title),
                    new KeyValuePair<string, string>("startDate", startTime.ToString("dd/MM/yyyy")),
                    new KeyValuePair<string, string>("startTime", startTime.ToString("h:mm tt")),
                    new KeyValuePair<string, string>("duration", durationText),
                    new KeyValuePair<string, string>("timeZone", timeZone),
                    new KeyValuePair<string, string>("year", Clock.Now.Year.ToString()),
                    new KeyValuePair<string, string>("studentProfilePicture", studentProfilePicture),
                    new KeyValuePair<string, string>("viewDetailsLink", viewDetailsLink),
                });

            await _emailService.SendAsync(student.Name, student.EmailAddress, L("BookingRequestEmailSubject"), studentEmailBody);
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

            List<EmailAttachment> attachments = new List<EmailAttachment>()
            {
                  new EmailAttachment
                  {
                      FileName = "event.ics",
                      FileData = _emailService.GetCalenderIcsFormat(calendarEvent.Id,calendarEvent.Title,calendarEvent.Type.ToString(),calendarEvent.StartTime,calendarEvent.EndTime)
                  }
            };

            await _emailService.SendAsync(recipient.Name, recipient.EmailAddress, L("BookingConfirmedEmailSubject"), emailBody, attachments);
        }
    }
}
