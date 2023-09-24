using System;
using System.Collections.Generic;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Ratings.Dto
{
    [AutoMapTo(typeof(ServiceRating))]
    public class CreateServiceRatingDto
    {
        public Guid ServiceId { get; set; }
        public RatingExperienceType ExperienceType { get; set; }
        public string Comments { get; set; }
        public long CreatorUserId { get; set; }
        public virtual ICollection<CreateServiceRatingAreaDto> ServiceRatingAreas { get; set; }
    }
}

