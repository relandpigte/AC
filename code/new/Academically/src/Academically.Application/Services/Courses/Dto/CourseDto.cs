using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Documents.Dto;
using Academically.Services.StudentCourses.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Courses.Dto
{
    [AutoMap(typeof(Course))]
    public class CourseDto : EntityDto<Guid>
    {

        public string Name { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public CourseStatus Status { get; set; }
        public decimal Price { get; set; }
        public CourseType Type { get; set; }
        public bool IsVisible { get; set; }
        public bool IsOpen { get; set; }
        public Guid? ImageDocumentId { get; set; }
        public Guid? CurrencyId { get; set; }
        public Guid? LanguageId { get; set; }
        public string Categories { get; set; }
        public PricingType? PricingType { get; set; }

        public DateTime CreationTime { get; set; }
        public string CourseImageUrl { get; set; }

        public UserDto CreatorUser { get; set; }
        public DocumentDto ImageDocument { get; set; }

        public IEnumerable<StudentCourseDto> StudentCourses { get; set; }
    }
}
