using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyCourses")]
    public class Course : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public CourseType Type { get; set; }
        public bool IsVisible { get; set; }
        public bool IsOpen { get; set; }

        public Guid ImageDocumentId { get; set; }
        public Guid LanguageId { get; set; }
        public Guid CurrencyId { get; set; }

        [ForeignKey("ImageDocumentId")]
        public virtual Document ImageDocument { get; set; }
        [ForeignKey("LanguageId")]
        public virtual SpokenLanguage Language { get; set; }
        [ForeignKey("CurrencyId")]
        public virtual Currency Currency { get; set; }
    }
}
