using Abp.Configuration;
using Academically.Application.Shared.Services;
using Academically.BackgroundJobs.JobArgs;
using Academically.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.BackgroundJobs
{
    public class SendPasswordResetEmailJob : AcademicallyBackgroundJobBase<SendPasswordResetEmailJobArgs>
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;

        public SendPasswordResetEmailJob(ISettingManager settingManager, IEmailService emailService)
        {
            _settingManager = settingManager;
            _emailService = emailService;
        }

        public override void Execute(SendPasswordResetEmailJobArgs args)
        {
            string clientRootAddress = _settingManager.GetSettingValue(AppSettingNames.App_ClientRootAddress);
            string registrationLink = $"{clientRootAddress}account/complete-reset-password/{args.PasswordResetId}";
            string subject = L("PasswordResetEmailSubject");
            string body = L("PasswordResetEmailMessage", registrationLink);

            _emailService.SendAsync(args.Email, args.Email, subject, body).Wait();
        }
    }
}
