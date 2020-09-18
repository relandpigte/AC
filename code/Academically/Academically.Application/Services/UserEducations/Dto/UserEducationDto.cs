using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Entities.Enums;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMap(typeof(UserEducation))]
    public class UserEducationDto : EntityDto<Guid>
    {
        public string Country { get; set; }
        public string UniversityOrCollege { get; set; }
        public string Degree { get; set; }
        public int StartYear { get; set; }
        public int EndYear { get; set; }
        public EducationLevel Level { get; set; }
        public long UserId { get; set; }
    }
}
