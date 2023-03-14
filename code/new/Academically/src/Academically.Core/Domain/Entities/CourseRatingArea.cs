using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("CourseRatingAreas")]
    public class CourseRatingArea : Entity<Guid>
    {
        public Guid CourseRatingId { get; set; }
        public RatingAreaType AreaType { get; set; }
        public int Rating { get; set; }

        [ForeignKey("CourseRatingId")]
        public virtual CourseRating CourseRating { get; set; }
    }
}
