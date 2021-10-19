using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyCourseSectionPages")]
    public class CourseSectionPage : CreationAuditedEntity<Guid>
    {
        public string PageContent { get; set; }
        public Guid CourseSectionId { get; set; }

        [ForeignKey("CourseSectionId")]
        public virtual CourseSection CourseSection { get; set; }
    }
}
