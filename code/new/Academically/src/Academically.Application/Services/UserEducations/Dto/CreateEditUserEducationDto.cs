using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMapTo(typeof(UserEducation))]
    public class CreateEditUserEducationDto : EntityDto<Guid?>
    {
        public long UserId { get; set; }
        public string City { get; set; }
        public string StartYear { get; set; }
        public string EndYear { get; set; }

        public string UniversityName { get; set; }
        public string UniversityCountryCode { get; set; }

        public IEnumerable<CreateEditUserEducationCourseDto> UserEducationCourses { get; set; }
    }
}
