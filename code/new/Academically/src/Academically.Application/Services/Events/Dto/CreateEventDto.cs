using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Events.Dto
{
    [AutoMapTo(typeof(Event))]
    public class CreateEventDto
    {
        public string Name { get; set; }
        public EventType Type { get; set; }
        public Guid? ParentId { get; set; }
    }
}
