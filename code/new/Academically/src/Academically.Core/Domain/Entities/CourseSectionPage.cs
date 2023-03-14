using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities
{
    [Table("CourseSectionPages")]
    public class CourseSectionPage : CreationAuditedEntity<Guid>
    {
        public string PageContent { get; set; }
        public Guid CourseSectionId { get; set; }
        public Guid? ImageDocumentId { get; set; }

        public string Description { get; set; }
        public string Duration { get; set; }
        public string CategoriesTags { get; set; }

        [ForeignKey("CourseSectionId")]
        public virtual CourseSection CourseSection { get; set; }
        [ForeignKey("ImageDocumentId")]
        public virtual Document ImageDocument { get; set; }
    }
}
