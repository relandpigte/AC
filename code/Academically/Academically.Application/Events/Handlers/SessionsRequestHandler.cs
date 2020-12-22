using System;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Abp.Timing;
using Abp.Timing.Timezone;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Entities.Enums;
using TimeZone = Academically.Entities.TimeZone;

namespace Academically.Events.Handlers
{
    public class SessionsRequestHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityChangedEventData<Session>>
    {
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<TutorOffer, Guid> _tutorOffersRepository;
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<TimeZone, string> _timeZonesRepository;
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly ITimeZoneConverter _timeZoneConverter;


        public SessionsRequestHandler(
            IRepository<User, long> usersRepository,
            IEmailService emailService,
            ISettingManager settingManager,
            IRepository<TutorOffer, Guid> tutorOffersRepository,
            IRepository<UserTutorial, Guid> userTutorialsRepository,
            IRepository<UserProfile, Guid> userProfilesRepository,
            IRepository<TimeZone, string> timeZonesRepository,
            ILocalizationManager localizationManager,
            ITimeZoneConverter timeZoneConverter
            ) : base(localizationManager)
        {
            _usersRepository = usersRepository;
            _emailService = emailService;
            _tutorOffersRepository = tutorOffersRepository;
            _userTutorialsRepository = userTutorialsRepository;
            _userProfilesRepository = userProfilesRepository;
            _timeZonesRepository = timeZonesRepository;
            _settingManager = settingManager;
            _timeZoneConverter = timeZoneConverter;
        }
        
        [UnitOfWork]
        public async Task HandleEventAsync(EntityChangedEventData<Session> eventData)
        {
            var tutorOffer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.Id == eventData.Entity.TutorOfferId);
            var userTutorial = await _userTutorialsRepository.FirstOrDefaultAsync(e => e.Id == tutorOffer.TutorialId);
            var studentProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.Id == userTutorial.StudentId);
            var student = await _usersRepository.FirstOrDefaultAsync(e => e.Id == studentProfile.UserId);
            var tutorProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.Id == tutorOffer.TutorId);
            var tutor = await _usersRepository.FirstOrDefaultAsync(e => e.Id == tutorProfile.UserId);
            var clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            var studentProposalLink = $"{clientRootAddress}app/student-proposal/{userTutorial.Id}";

            var timeZoneId = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);
            var timeZone = await _timeZonesRepository.GetAsync(timeZoneId);
            var sessionDate = _timeZoneConverter.Convert(eventData.Entity.SessionDate.Value).Value;
            var sessionDuration = GetDuration(eventData.Entity.Duration);
            var sessionName = "Tutorial Session with " + student.FullName;

            if (eventData.Entity.Status == SessionStatus.Confirmed)
            {
                var subject = L("ConfirmSessionEmailSubject");
                var body = L("ConfirmSessionEmailMessage", tutor.FullName, sessionDate, sessionDuration, timeZone.Name);
                await _emailService.SendAsync(student.EmailAddress, student.EmailAddress, subject, body);

                var adminSubject = L("ConfirmSessionAdminEmailSubject");
                var adminBody = L("ConfirmSessionAdminEmailMessage", sessionName, sessionDate, sessionDuration, timeZone.Name);
                await _emailService.SendAsync(tutor.EmailAddress, tutor.EmailAddress, adminSubject, adminBody);
            } 
            else if(eventData.Entity.Status == SessionStatus.Pending)
            {
                var subject = L("BookSessionEmailSubject");
                var body = L("BookSessionEmailMessage", tutor.FullName, sessionDate, sessionDuration, timeZone.Name);
                await _emailService.SendAsync(student.EmailAddress, student.EmailAddress, subject, body);

                var adminSubject = L("BookSessionAminEmailSubject");
                var adminBody = L("BookSessionAminEmailMessage", sessionName, sessionDate, sessionDuration, timeZone.Name, studentProposalLink);
                await _emailService.SendAsync(tutor.EmailAddress, tutor.EmailAddress, adminSubject, adminBody);
            }
        }

        private string GetDuration(int totalMinutes)
        {
            var hours = (totalMinutes % 1440) / 60;
            var minutes = totalMinutes % 60;
            var duration = hours + ":" + minutes;

            return duration;

        }
    }
}
