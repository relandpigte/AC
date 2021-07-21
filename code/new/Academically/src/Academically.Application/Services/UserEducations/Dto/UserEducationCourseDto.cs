using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMap(typeof(UserEducationCourse))]
    public class UserEducationCourseDto : EntityDto<Guid>
    {
        public string Title { get; set; }
        public string Grade { get; set; }
        public Guid AcademicLevelId { get; set; }
        public Guid AcademicLevelQualificationId { get; set; }

        public AcademicLevelDto AcademicLevel { get; set; }
        public AcademicLevelQualificationDto AcademicLevelQualification { get; set; }
    }
}
