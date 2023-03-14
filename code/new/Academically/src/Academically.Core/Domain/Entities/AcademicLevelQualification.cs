using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicLevelQualifications")]
    public class AcademicLevelQualification : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public Guid AcademicLevelId { get; set; }
        public long? ReviewerUserId { get; set; }
        public DateTime? ReviewTime { get; set; }
        public AcademicLevelQualificationReviewStatus ReviewStatus { get; set; }

        [ForeignKey("AcademicLevelId")]
        public virtual AcademicLevel AcademicLevel { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("ReviewerUserId")]
        public virtual User ReviewerUser { get; set; }
    }
}
