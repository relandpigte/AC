using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using System;

namespace Academically.Services.Ratings.Dto
{
    [AutoMap(typeof(CourseRating))]
    public class CourseRatingDto : EntityDto<Guid>
    {
        public Guid CourseId { get; set; }
        public ServicesType? ServiceType { get; set; }
        public long? ServiceOwnerId { get; set; }
        public RatingExperienceType ExperienceType { get; set; }
        public string Comments { get; set; }
        public DateTime CreationTime { get; set; }
        public decimal TotalRatingPercentage { get; set; }

        public UserDto Reviewer { get; set; }
    }
}
