using System;

namespace Academically.BackgroundJobs.JobArgs
{
    [Serializable]
    public class SaveUserLastLoginTimeJobArgs
    {
        public long UserId { get; set; }
        public DateTime LastLoginTime { get; set; }
    }
}
