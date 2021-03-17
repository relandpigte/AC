using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserEducations")]
    public class UserEducation : Entity<Guid>
    {
        public long UserId { get; set; }
        public Guid UniversityId { get; set; }
        public string City { get; set; }
        public string StartYear { get; set; }
        public string EndYear { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("UniversityId")]
        public virtual University University { get; set; }

        public virtual ICollection<UserEducationLevel> UserEducationLevels { get; set; }
    }
}
