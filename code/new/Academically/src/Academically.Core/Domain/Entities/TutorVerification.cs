using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyTutorVerifications")]
    public class TutorVerification : CreationAuditedEntity<Guid>
    {
        public BecomeATutorStep CurrentStep { get; set; }
        public TutorVerificationStatus Status { get; set; }
        public DateTime? ReviewTime { get; set; }
        public long? ReviewerUserId { get; set; }
    }
}
