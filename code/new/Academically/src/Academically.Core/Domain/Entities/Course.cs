using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("Courses")]
    public class Course : CreationAuditedEntity<Guid>, ISimpleService
    {
        [NotMapped]
        public ServicesType ServiceType { get; set; } = ServicesType.Course;
        public string Name { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public CourseStatus Status { get; set; }
        public decimal Price { get; set; }
        public CourseType Type { get; set; }
        public bool IsVisible { get; set; }
        public bool IsOpen { get; set; }

        public Guid? ImageDocumentId { get; set; }
        public Guid? LanguageId { get; set; }
        public Guid? CurrencyId { get; set; }
        public string Categories { get; set; }
        public PricingType? PricingType { get; set; }

        public int? NumberOfPlaces { get; set; }
        public DateTime? StartDate { get; set; }
        public string StartTime { get; set; }
        public DateTime? EndDate { get; set; }
        public string EndTime { get; set; }
        public CommentSetting? CommentsVisibility { get; set; }
        public bool? CommentsNeedAdminApproval { get; set; }


        [ForeignKey("ImageDocumentId")]
        public virtual Document ImageDocument { get; set; }
        [ForeignKey("LanguageId")]
        public virtual SpokenLanguage Language { get; set; }
        [ForeignKey("CurrencyId")]
        public virtual Currency Currency { get; set; }
        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<StudentCourse> StudentCourses { get; set; }
    }
}
