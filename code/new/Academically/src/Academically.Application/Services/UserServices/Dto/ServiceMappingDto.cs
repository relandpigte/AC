using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Services.Dto;
using System;

namespace Academically.Services.UserServices.Dto
{
    [AutoMap(typeof(ServiceMapping))]
    public class ServiceMappingDto : EntityDto<Guid>
    {
        public ServiceDto Service { get; set; }

        public Guid? Node1Id { get; set; }
        public Guid? Node2Id { get; set; }
        public Guid? Node3Id { get; set; }
    }
}
