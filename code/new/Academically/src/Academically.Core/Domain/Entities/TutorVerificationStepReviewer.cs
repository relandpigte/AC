using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("TutorVerificationStepReviewers")]
    public class TutorVerificationStepReviewer : CreationAuditedEntity<Guid>
    {
        public TutorVerificationStepStatus OldStatus { get; set; }
        public TutorVerificationStepStatus NewStatus { get; set; }
        public string Comments { get; set; }

        public Guid TutorVerificationStepId { get; set; }

        [ForeignKey("TutorVerificationStepId")]
        public virtual TutorVerificationStep TutorVerificationStep { get; set; }
    }
}
