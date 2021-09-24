using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;

namespace Academically.Services.Courses.Dto
{
    [AutoMap(typeof(Course))]
    public class CourseDto : EntityDto<Guid>
    {

        public string Name { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public CourseType Type { get; set; }
        public bool IsVisible { get; set; }
        public bool IsOpen { get; set; }

        public DateTime CreationTime { get; set; }

        public UserDto CreatorUser { get; set; }
    }
}
