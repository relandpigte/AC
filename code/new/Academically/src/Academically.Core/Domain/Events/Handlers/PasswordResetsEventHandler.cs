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
    public class PasswordResetsEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<PasswordReset>>
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;

        public PasswordResetsEventHandler(
            ISettingManager settingManager,
            IEmailService emailService,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _settingManager = settingManager;
            _emailService = emailService;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<PasswordReset> eventData)
        {
            string clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            string registrationLink = $"{clientRootAddress}account/complete-reset-password/{eventData.Entity.Id}";
            string subject = L("PasswordResetEmailSubject");
            string body = L("PasswordResetEmailMessage", registrationLink);

            await _emailService.SendAsync(eventData.Entity.Email, eventData.Entity.Email, subject, body);
        }
    }
}