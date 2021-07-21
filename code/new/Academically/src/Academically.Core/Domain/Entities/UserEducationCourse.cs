using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserEducationCourses")]
    public class UserEducationCourse : Entity<Guid>
    {
        public string Title { get; set; }
        public string Grade { get; set; }
        public Guid AcademicLevelId { get; set; }
        public Guid AcademicLevelQualificationId { get; set; }
        public Guid UserEducationId { get; set; }

        [ForeignKey("AcademicLevelId")]
        public virtual AcademicLevel AcademicLevel { get; set; }

        [ForeignKey("AcademicLevelQualificationId")]
        public virtual AcademicLevelQualification AcademicLevelQualification { get; set; }

        [ForeignKey("UserEducationId")]
        public virtual UserEducation UserEducation { get; set; }
    }
}
