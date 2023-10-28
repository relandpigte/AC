using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.StudentCourses.Dto
{
    [AutoMapTo(typeof(CourseRating))]
    public class CreateCourseRatingDto
    {
        public Guid CourseId { get; set; }
        public ServicesType? ServiceType { get; set; }
        public long? ServiceOwnerId { get; set; }

        public RatingExperienceType ExperienceType { get; set; }
        public string Comments { get; set; }

        public long CreatorUserId { get; set; }

        public virtual ICollection<CreateCourseRatingAreaDto> CourseRatingAreas { get; set; }
    }
}

