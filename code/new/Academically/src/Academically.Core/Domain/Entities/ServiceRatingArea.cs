using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("serviceratingareas")]
    public class ServiceRatingArea : FullAuditedEntity<Guid>
    {
        public Guid ServiceRatingId { get; set; }
        public RatingAreaType AreaType { get; set; }
        public int Rating { get; set; }

        [ForeignKey("ServiceRatingId")]
        public virtual ServiceRating ServiceRating { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}
