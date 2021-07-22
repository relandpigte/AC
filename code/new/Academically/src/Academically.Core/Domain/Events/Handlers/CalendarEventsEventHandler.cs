using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using SourceCloud.Core.Services;

namespace Academically.Domain.Events.Handlers
{
    public class CalendarEventsEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityUpdatedEventData<CalendarEvent>>
    {
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IRepository<RescheduleComment, Guid> _rescheduleCommentsRepository;
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;

        public CalendarEventsEventHandler(
            IRepository<User, long> usersRepository,
            IRepository<Project, Guid> projectsRepository,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<RescheduleComment, Guid> rescheduleCommentsRepository,
            ISettingManager settingManager,
            IEmailService emailService,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _usersRepository = usersRepository;
            _projectsRepository = projectsRepository;
            _projectOffersRepository = projectOffersRepository;
            _rescheduleCommentsRepository = rescheduleCommentsRepository;
            _settingManager = settingManager;
            _emailService = emailService;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityUpdatedEventData<CalendarEvent> eventData)
        {
            var calendarEvent = eventData.Entity;
            if (calendarEvent.Type == CalendarEventType.Cancelled)
            {
                var project = await _projectsRepository.GetAsync(calendarEvent.ProjectId.Value);
                var projectOffer = await _projectOffersRepository.GetAsync(calendarEvent.ProjectOfferId.Value);
                var student = await _usersRepository.GetAsync(calendarEvent.CreatorUserId.Value);
                var tutor = await _usersRepository.GetAsync(projectOffer.CreatorUserId.Value);
                var rescheduleComment = (await _rescheduleCommentsRepository.GetAllListAsync(e => e.CalendarEventId == calendarEvent.Id))
                    .OrderByDescending(e => e.CreationTime)
                    .FirstOrDefault();

                string studentEmailSubject = L("BookingCancelledStudentEmailSubject", calendarEvent.Title);
                string studentEmailBody = L("BookingCancelledStudentEmailMessage", student.FullName, tutor.FullName, calendarEvent.Title, project.Name, rescheduleComment.Comments);
                await _emailService.SendAsync(student.FullName, student.EmailAddress, studentEmailSubject, studentEmailBody);

                string tutorEmailSubject = L("BookingCancelledTutorEmailSubject", calendarEvent.Title);
                string tutorEmailBody = L("BookingCancelledTutorEmailMessage", tutor.FullName, student.FullName, calendarEvent.Title, project.Name, rescheduleComment.Comments);
                await _emailService.SendAsync(tutor.FullName, tutor.EmailAddress, tutorEmailSubject, tutorEmailBody);
            }

        }
    }
}
