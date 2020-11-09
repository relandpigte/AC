using System;

namespace Academically.BackgroundJobs.JobArgs
{
    [Serializable]
    public class SendResearchMethodRequestEmailJobArgs
    {
        public string Name { get; set; }
        public string Comments { get; set; }
        public Guid ParentId { get; set; }
        public long UserId { get; set; }
    }
}
