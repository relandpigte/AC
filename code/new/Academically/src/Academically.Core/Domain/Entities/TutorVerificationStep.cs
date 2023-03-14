using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("TutorVerificationSteps")]
    public class TutorVerificationStep : CreationAuditedEntity<Guid>
    {
        public BecomeATutorStep Step { get; set; }
        public TutorVerificationStepStatus Status { get; set; }
        public DateTime? ReviewTime { get; set; }
        public long? ReviewerUserId { get; set; }
        public Guid TutorVerificationId { get; set; }

        [ForeignKey("TutorVerificationId")]
        public virtual TutorVerification TutorVerification { get; set; }
    }
}
