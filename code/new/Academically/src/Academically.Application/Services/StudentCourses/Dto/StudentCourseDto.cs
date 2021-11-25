using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.StudentCourses.Dto
{
    [AutoMap(typeof(StudentCourse))]
    public class StudentCourseDto : EntityDto<Guid>
    {
        public Guid CourseId { get; set; }
    }
}

