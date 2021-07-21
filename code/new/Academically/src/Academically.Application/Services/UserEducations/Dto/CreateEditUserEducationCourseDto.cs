using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMapTo(typeof(UserEducationCourse))]
    public class CreateEditUserEducationCourseDto : EntityDto<Guid?>
    {
        public string Title { get; set; }
        public string Grade { get; set; }
        public Guid AcademicLevelId { get; set; }
        public Guid AcademicLevelQualificationId { get; set; }
    }
}
