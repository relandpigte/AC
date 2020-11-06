using System;

namespace Academically.BackgroundJobs.JobArgs
{
    public class SendSupportServiceRequestEmailJobArgs
    {
        public string Name { get; set; }
        public string Comments { get; set; }
        public Guid ParentId { get; set; }
        public long UserId { get; set; }
    }
}
