using Abp.Configuration;
using Abp.Domain.Uow;
using Academically.Application.Shared.Services;
using Academically.BackgroundJobs.JobArgs;
using Academically.Configuration;

namespace Academically.BackgroundJobs
{
    public class SendRegistrationEmailJob : AcademicallyBackgroundJobBase<SendRegistrationEmailJobArgs>
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;

        public SendRegistrationEmailJob(ISettingManager settingManager, IEmailService emailService)
        {
            _settingManager = settingManager;
            _emailService = emailService;
        }

        [UnitOfWork]
        public override void Execute(SendRegistrationEmailJobArgs args)
        {
            string clientRootAddress = _settingManager.GetSettingValue(AppSettingNames.App_ClientRootAddress);
            string registrationLink = $"{clientRootAddress}account/complete-registration/{args.RegistrationId}";
            string subject = L("RegistrationEmailSubject");
            string body = L("RegistrationEmailMessage", registrationLink);

            _emailService.SendAsync(args.EmailAddress, args.EmailAddress, subject, body).Wait();
        }
    }
}
