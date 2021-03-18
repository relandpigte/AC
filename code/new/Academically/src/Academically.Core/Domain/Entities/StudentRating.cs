using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyStudentRatings")]
    public class StudentRating : CreationAuditedEntity<Guid>
    {
        public long StudentId { get; set; }
        public RatingExperienceType ExperienceType { get; set; }
        public string Comments { get; set; }

        [ForeignKey("StudentId")]
        public virtual User Student { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User Reviewer { get; set; }
    }
}
