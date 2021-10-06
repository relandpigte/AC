using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Courses.Dto;

namespace Academically.Services.CourseSections.Dto
{
    [AutoMap(typeof(CourseSection))]
    public class CourseSectionDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public CourseSectionType Type { get; set; }
        public CourseSectionStatus Status { get; set; }
        public int DisplayOrder { get; set; }
        public Guid CourseId { get; set; }
        public Guid? ParentId { get; set; }
        public DateTime CreationTime { get; set; }
        public int MyProperty { get; set; }
        public List<CourseSectionDto> Children { get; set; }
        public CourseDto Course { get; set; }
    }
}
