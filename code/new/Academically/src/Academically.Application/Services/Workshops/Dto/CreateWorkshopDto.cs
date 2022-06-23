using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Workshops.Dto
{
    [AutoMapTo(typeof(Workshop))]
    public class CreateWorkshopDto
    {
        public string Name { get; set; }
        public WorkshopType Type { get; set; }
        public Guid? ParentId { get; set; }
    }
}
