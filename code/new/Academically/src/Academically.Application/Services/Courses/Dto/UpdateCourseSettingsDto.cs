using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Courses.Dto
{
    [AutoMapTo(typeof(Course))]
    public class UpdateCourseSettingsDto : EntityDto<Guid>
    {
        public bool IsVisible { get; set; }
        public bool IsOpen { get; set; }
    }
}
