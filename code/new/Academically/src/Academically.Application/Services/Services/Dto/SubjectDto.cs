using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.Services.Dto
{
    [AutoMap(typeof(Subject))]
    public class SubjectDto : EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
