using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserEducationLevels")]
    public class UserEducationLevel : Entity<Guid>
    {
        public Guid UserEducationId { get; set; }
        public Guid EducationLevelId { get; set; }
        public string Degree { get; set; }
        public string Grade { get; set; }

        [ForeignKey("UserEducationId")]
        public virtual UserEducation UserEducation { get; set; }

        [ForeignKey("EducationLevelId")]
        public virtual EducationLevel EducationLevel { get; set; }
    }
}
