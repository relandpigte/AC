using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Events.Handlers
{
    public class GuardianConsentProfilesEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityChangedEventData<GuardianConsentProfile>>
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<User, long> _usersRepository;
        public GuardianConsentProfilesEventHandler(
            ISettingManager settingManager,
            ILocalizationManager localizationManager,
            IRepository<UserTutorial, Guid> userTutorialsRepository,
            IRepository<UserProfile, Guid> userProfilesRepository,
            IEmailService emailService,
            IRepository<User, long> usersRepository
            ) : base(localizationManager)
        {
            _userTutorialsRepository = userTutorialsRepository;
            _userProfilesRepository = userProfilesRepository;
            _usersRepository = usersRepository;
            _settingManager = settingManager;
            _emailService = emailService;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityChangedEventData<GuardianConsentProfile> eventData) 
        {
            var tutorial = new UserTutorial();

            if(eventData.Entity.SourceType == SourceType.Tutorial)
                tutorial = await _userTutorialsRepository.FirstOrDefaultAsync(e => e.Id == eventData.Entity.ReferenceId);
            
            var studentProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.Id == tutorial.StudentId);
            var student = await _usersRepository.FirstOrDefaultAsync(e => e.Id == studentProfile.UserId);
            var clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            var link = $"{clientRootAddress}guardian-approval/{eventData.Entity.Id}";
            var guardianFullName = $"{eventData.Entity.FirstName} {eventData.Entity.LastName}";

            if(!eventData.Entity.HasExpired.Value)
            {
                var subject = L("GuardianConsentEmailSubject");
                var body = L("GuardianConsentEmailMessage", guardianFullName, student.FullName, link);
                await _emailService.SendAsync(eventData.Entity.Email, eventData.Entity.Email, subject, body);
            } 
            else 
            {
                var guardianEmailSubject = L("ConfirmsGuardianTutorialAccesSubject");
                var guardianEmailBody = L("ConfirmGuardianTutorialAccessMessage", guardianFullName, student.FullName);
                await _emailService.SendAsync(eventData.Entity.Email, eventData.Entity.Email, guardianEmailSubject, guardianEmailBody);

                var studentEmailSubject = L("ConfirmTutorialAccessSubject");
                var studentEmailBody = L("ConfirmTutorialAccessMessage", student.FullName, guardianFullName);
                await _emailService.SendAsync(student.EmailAddress, student.EmailAddress, studentEmailSubject, studentEmailBody);
            }
        }
    }
}
