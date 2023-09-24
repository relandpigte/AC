using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("serviceratings")]
    public class ServiceRating : FullAuditedEntity<Guid>
    {
        public Guid ServiceId { get; set; }
        public RatingExperienceType ExperienceType { get; set; }
        public string Comments { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
        public virtual ICollection<ServiceRatingArea> ServiceRatingAreas { get; set; }
    }
}
