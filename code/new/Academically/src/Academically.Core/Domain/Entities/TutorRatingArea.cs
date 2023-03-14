using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("TutorRatingAreas")]
    public class TutorRatingArea : Entity<Guid>
    {
        public Guid TutorRatingId { get; set; }
        public RatingAreaType AreaType { get; set; }
        public int Rating { get; set; }

        [ForeignKey("TutorRatingId")]
        public virtual TutorRating TutorRating { get; set; }
    }
}
