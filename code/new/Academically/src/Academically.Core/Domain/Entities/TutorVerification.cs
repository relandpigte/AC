using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("TutorVerifications")]
    public class TutorVerification : CreationAuditedEntity<Guid>
    {
        public TutorVerification()
        {
            TutorVerificationSteps = new HashSet<TutorVerificationStep>();
        }

        public BecomeATutorStep CurrentStep { get; set; }
        public TutorVerificationStatus Status { get; set; }
        public DateTime? ReviewTime { get; set; }
        public long? ReviewerUserId { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<TutorVerificationStep> TutorVerificationSteps { get; set; }
    }
}
