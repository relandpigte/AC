using Abp.Configuration;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Configuration;
using Academically.Domain.Entities;
using SourceCloud.Core.Services;
using System.Threading.Tasks;

namespace Academically.Domain.Events.Handlers
{
    public class RegistrationsEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<Registration>>
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;

        public RegistrationsEventHandler(
            ISettingManager settingManager,
            IEmailService emailService,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _settingManager = settingManager;
            _emailService = emailService;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<Registration> eventData)
        {
            string clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            string registrationLink = $"{clientRootAddress}account/complete-registration/{eventData.Entity.Id}";
            string subject = L("RegistrationEmailSubject");
            string body = L("RegistrationEmailMessage", registrationLink);

            await _emailService.SendAsync(eventData.Entity.EmailAddress, eventData.Entity.EmailAddress, subject, body);
        }
    }
}
