using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Events.Dto
{
    [AutoMapTo(typeof(StudentEvent))]
    public class CreateStudentEventDto
    {
        public Guid EventId { get; set; }
        public bool SaveOnly { get; set; }
    }
}

