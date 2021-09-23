using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Courses.Dto
{
    [AutoMap(typeof(Course))]
    public class CourseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
