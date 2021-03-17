using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMap(typeof(UserEducationLevel))]
    public class UserEducationLevelDto : EntityDto<Guid?>
    {
        public Guid UserEducationId { get; set; }
        public Guid EducationLevelId { get; set; }
        public string Degree { get; set; }
        public string Grade { get; set; }

        public string EducationLevelName { get; set; }
    }
}
