using System;
namespace Academically.BackgroundJobs.JobArgs
{
    public class SendRegistrationEmailJobArgs
    {
        public Guid RegistrationId { get; set; }
        public string EmailAddress { get; set; }
    }
}
