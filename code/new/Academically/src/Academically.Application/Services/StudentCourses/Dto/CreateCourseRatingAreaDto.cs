using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.StudentCourses.Dto
{
    [AutoMapTo(typeof(CourseRatingArea))]
    public class CreateCourseRatingAreaDto
    {
        public RatingAreaType AreaType { get; set; }
        public int Rating { get; set; }
    }
}

