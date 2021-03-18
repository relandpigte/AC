using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyTutorRatings")]
    public class TutorRating : CreationAuditedEntity<Guid>
    {
        public long TutorId { get; set; }
        public RatingExperienceType ExperienceType { get; set; }
        public string Comments { get; set; }

        [ForeignKey("TutorId")]
        public virtual User Reviewer { get; set; }

        public virtual ICollection<TutorRatingArea> TutorRatingAreas { get; set; }
    }
}
