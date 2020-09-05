using System;

namespace Academically.BackgroundJobs.JobArgs
{
    public class SaveUserLastLoginTimeJobArgs
    {
        public long UserId { get; set; }
        public DateTime LastLoginTime { get; set; }
    }
}
