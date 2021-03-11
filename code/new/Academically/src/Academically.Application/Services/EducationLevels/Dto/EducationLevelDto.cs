using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.EducationLevels.Dto
{
    [AutoMap(typeof(EducationLevel))]
    public class EducationLevelDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string ShortName { get; set; }
    }
}
