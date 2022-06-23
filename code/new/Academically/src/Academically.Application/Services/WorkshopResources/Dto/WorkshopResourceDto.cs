using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.WorkshopResources.Dto
{
	[AutoMapFrom(typeof(WorkshopResource))]
	public class WorkshopResourceDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public WorkshopResourceType Type { get; set; }
        public Guid WorkshopId { get; set; }
        public Guid? DocumentId { get; set; }
        public DateTime CreationTime { get; set; }

        public Document Document { get; set; }
    }
}

