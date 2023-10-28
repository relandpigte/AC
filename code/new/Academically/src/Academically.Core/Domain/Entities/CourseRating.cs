using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("CourseRatings")]
    public class CourseRating : CreationAuditedEntity<Guid>
    {
        public Guid CourseId { get; set; }
        public ServicesType? ServiceType { get; set; }
        public long? ServiceOwnerId { get; set; }
        public RatingExperienceType ExperienceType { get; set; }
        public string Comments { get; set; }

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User Reviewer { get; set; }

        public virtual ICollection<CourseRatingArea> CourseRatingAreas { get; set; }
    }
}
