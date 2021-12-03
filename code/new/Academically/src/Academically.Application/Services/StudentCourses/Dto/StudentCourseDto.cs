using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Courses.Dto;
using Academically.Services.StudentCourseSections.Dto;

namespace Academically.Services.StudentCourses.Dto
{
    [AutoMap(typeof(StudentCourse))]
    public class StudentCourseDto : EntityDto<Guid>
    {
        public Guid CourseId { get; set; }
        public CourseDto Course { get; set; }

        public IEnumerable<StudentCourseSectionDto> StudentCourseSections { get; set; }
    }
}

