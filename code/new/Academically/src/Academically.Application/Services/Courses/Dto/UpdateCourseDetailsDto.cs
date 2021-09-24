using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Courses.Dto
{
    [AutoMapTo(typeof(Course))]
    public class UpdateCourseDetailsDto : EntityDto<Guid>
    {
        [Required]
        public string Name { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }


        public IFormFile File { get; set; }
    }
}
