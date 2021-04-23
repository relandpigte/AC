using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Academically.Services.Services.Dto
{
    [AutoMap(typeof(Service))]
    public class ServiceDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid ServiceMappingId { get; set; }

        public IEnumerable<ServiceDto> Children { get; set; }
    }
}
