using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Events.Dto
{
    [AutoMapFrom(typeof(StudentEvent))]
    public class StudentEventDto : EntityDto<Guid>
    {
        public Guid EventId { get; set; }
        public bool SaveOnly { get; set; }

        public EventDto Event { get; set; }
    }
}

