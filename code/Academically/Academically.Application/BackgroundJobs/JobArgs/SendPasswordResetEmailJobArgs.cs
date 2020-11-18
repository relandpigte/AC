using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.BackgroundJobs.JobArgs
{
    public class SendPasswordResetEmailJobArgs
    {
        public Guid PasswordResetId { get; set; }
        public string Email { get; set; }
    }
}
