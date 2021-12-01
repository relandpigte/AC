using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.CourseSections.Dto;

namespace Academically.Services.StudentCourseSections.Dto
{
    [AutoMap(typeof(StudentCourseSection))]
    public class StudentCourseSectionDto : EntityDto<Guid>
    {
        public StudentCourseSectionStatus Status { get; set; }
        public Guid StudentCourseId { get; set; }
        public Guid CourseSectionId { get; set; }

        public virtual CourseSectionDto CourseSection { get; set; }
    }
}

