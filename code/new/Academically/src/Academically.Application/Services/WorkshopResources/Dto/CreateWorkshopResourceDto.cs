using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.WorkshopResources.Dto
{
    [AutoMapTo(typeof(WorkshopResource))]
    public class CreateWorkshopResourceDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public WorkshopResourceType Type { get; set; }
        public Guid WorkshopId { get; set; }
    }
}
