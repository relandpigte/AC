using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyCourseSections")]
    public class CourseSection : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public CourseSectionType Type { get; set; }
        public CourseSectionStatus Status { get; set; }
        public int DisplayOrder { get; set; }
        public Guid CourseId { get; set; }
        public Guid? ParentId { get; set; }

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; }
        [ForeignKey("ParentId")]
        public virtual CourseSection Parent { get; set; }
    }
}
