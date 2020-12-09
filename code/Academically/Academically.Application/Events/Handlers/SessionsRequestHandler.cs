using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TimeZoneConverter;

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
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly RoleManager _roleManager;


        public SessionsRequestHandler(
            IRepository<User, long> usersRepository,
            IEmailService emailService,
            RoleManager roleManager,
            ISettingManager settingManager,
            IRepository<TutorOffer, Guid> tutorOffersRepository,
            IRepository<UserTutorial, Guid> userTutorialsRepository,
            IRepository<UserProfile, Guid> userProfilesRepository,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _usersRepository = usersRepository;
            _emailService = emailService;
            _roleManager = roleManager;
            _tutorOffersRepository = tutorOffersRepository;
            _userTutorialsRepository = userTutorialsRepository;
            _userProfilesRepository = userProfilesRepository;
            _settingManager = settingManager;
        }
        
        [UnitOfWork]
        public async Task HandleEventAsync(EntityChangedEventData<Session> eventData)
        {
            if(eventData.Entity.Status == SessionStatus.Confirmed)
            {
                var tutorOffer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.Id == eventData.Entity.TutorOfferId);
                var userTutorial = await _userTutorialsRepository.FirstOrDefaultAsync(e => e.Id == tutorOffer.TutorialId);
                var student = await _usersRepository.FirstOrDefaultAsync(e => e.Id == userTutorial.UserId);
                var tutorProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.Id == tutorOffer.TutorId);
                var tutor = await _usersRepository.FirstOrDefaultAsync(e => e.Id == tutorProfile.UserId);
                var clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
                var studentProposalLink = $"{clientRootAddress}app/student-proposal/{userTutorial.Id}";
                var sessionDate = ConvertToLocal(eventData.Entity.SessionDate, eventData.Entity.TimeZone);
                var sessionDuration = GetDuration(eventData.Entity.Duration);

                var subject = L("ConfirmSessionEmailSubject");
                var body = L("ConfirmSessionEmailMessage", tutor.FullName, sessionDate, sessionDuration, eventData.Entity.TimeZone);
                await _emailService.SendAsync(student.EmailAddress, student.EmailAddress, subject, body);

                var adminSubject = L("ConfirmSessionAdminEmailSubject");
                var adminBody = L("ConfirmSessionAdminEmailMessage", student.FullName, sessionDate, sessionDuration, eventData.Entity.TimeZone, studentProposalLink);
                await _emailService.SendAsync(tutor.EmailAddress, tutor.EmailAddress, adminSubject, adminBody);
            } 
            else if(eventData.Entity.Status == SessionStatus.Pending)
            {
                var tutorOffer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.Id == eventData.Entity.TutorOfferId);
                var userTutorial = await _userTutorialsRepository.FirstOrDefaultAsync(e => e.Id == tutorOffer.TutorialId);
                var student = await _usersRepository.FirstOrDefaultAsync(e => e.Id == userTutorial.UserId);
                var tutorProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.Id == tutorOffer.TutorId);
                var tutor = await _usersRepository.FirstOrDefaultAsync(e => e.Id == tutorProfile.UserId);
                var clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
                var studentProposalLink = $"{clientRootAddress}app/student-proposal/{userTutorial.Id}";
                var sessionDate = ConvertToLocal(eventData.Entity.SessionDate, eventData.Entity.TimeZone);
                var sessionDuration = GetDuration(eventData.Entity.Duration);

                var subject = L("BookSessionEmailSubject");
                var body = L("BookSessionEmailMessage", tutor.FullName, sessionDate, sessionDuration, eventData.Entity.TimeZone);
                await _emailService.SendAsync(student.EmailAddress, student.EmailAddress, subject, body);

                var adminSubject = L("BookSessionAminEmailSubject");
                var adminBody = L("BookSessionAminEmailMessage", student.FullName, sessionDate, sessionDuration, eventData.Entity.TimeZone, studentProposalLink);
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
        private DateTime ConvertToLocal(DateTime? dateStart, string timezone)
        {
            var timeZone = TZConvert.GetTimeZoneInfo(timezone);
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone.Id);
            var dateStartUtc = TimeZoneInfo.ConvertTimeFromUtc(dateStart.Value, timeZoneInfo);

            return dateStartUtc;
        }
    }
}
