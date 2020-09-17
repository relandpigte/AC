using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Authorization.Users;
using Academically.Entities.Enums;

namespace Academically.Entities
{
    [Table("AcademicallyUserEducations")]
    public class UserEducation : Entity<Guid>
    {
        public string Country { get; set; }
        public string UniversityOrCollege { get; set; }
        public string Degree { get; set; }
        public int StartYear { get; set; }
        public int EndYear { get; set; }
        public EducationLevel Level { get; set; }
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
