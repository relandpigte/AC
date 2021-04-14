using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Universities.Dto
{
    [AutoMap(typeof(University))]
    public class UniversityDto : EntityDto<Guid>
    {
        public string HeProvider { get; set; }
    }
}
