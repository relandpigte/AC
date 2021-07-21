using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMap(typeof(AcademicLevel))]
    public class AcademicLevelDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
    }
}
