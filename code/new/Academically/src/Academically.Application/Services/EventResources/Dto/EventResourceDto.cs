using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.EventResources.Dto
{
	[AutoMapFrom(typeof(EventResource))]
	public class EventResourceDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public EventResourceType Type { get; set; }
        public Guid EventId { get; set; }
        public Guid? DocumentId { get; set; }
        public DateTime CreationTime { get; set; }

        public Document Document { get; set; }
    }
}

