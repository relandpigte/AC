using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyPhotoIdVerifications")]
    public class PhotoIdVerification : CreationAuditedEntity<Guid>
    {
        public PhotoIdVerificationStatus Status { get; set; }
        public Guid DocumentId { get; set; }
        public Guid? ReviewerUserId { get; set; }
        public DateTime? ReviewTime { get; set; }

        [ForeignKey("DocumentId")]
        public Document Document { get; set; }
    }
}
