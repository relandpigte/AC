using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.EventResources.Dto
{
    [AutoMapTo(typeof(EventResource))]
    public class CreateEventResourceDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public EventResourceType Type { get; set; }
        public Guid EventId { get; set; }
    }
}