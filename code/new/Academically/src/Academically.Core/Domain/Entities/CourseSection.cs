using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("CourseSections")]
    public class CourseSection : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public CourseSectionType Type { get; set; }
        public CourseSectionStatus Status { get; set; }
        public int DisplayOrder { get; set; }
        public Guid CourseId { get; set; }
        public Guid? ParentId { get; set; }
        public bool IsVisible { get; set; }
        public bool IsAssignmentEnabled { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? ImageDocumentId { get; set; }
        public string ApproximateLessonDuration { get; set; }
        public CourseSectionDripType? DripType { get; set; }
        public string DripValue { get; set; }
        public bool? IsSendEmailEnabled { get; set; }
        public string EmailSubject { get; set; }
        public string EmailMessage { get; set; }
        public CommentSetting? CommentSetting { get; set; }
        public bool? IsCommentModerationEnabled { get; set; }
        public bool? IsStorePreviewEnabled { get; set; }
        public bool IsPrerequsite { get; set; }
        public bool AreAllPrerequisite { get; set; }

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; }

        [ForeignKey("ParentId")]
        public virtual CourseSection Parent { get; set; }

        [ForeignKey("ImageDocumentId")]
        public virtual Document ImageDocument { get; set; }

        public virtual ICollection<CourseSection> Children { get; set; }
    }
}
