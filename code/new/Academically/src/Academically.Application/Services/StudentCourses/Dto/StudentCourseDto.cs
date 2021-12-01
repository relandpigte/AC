using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Courses.Dto;

namespace Academically.Services.StudentCourses.Dto
{
    [AutoMap(typeof(StudentCourse))]
    public class StudentCourseDto : EntityDto<Guid>
    {
        public Guid CourseId { get; set; }
        public CourseDto Course { get; set; }
    }
}

