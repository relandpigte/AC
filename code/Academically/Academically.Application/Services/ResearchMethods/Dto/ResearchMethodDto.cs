using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;

namespace Academically.Services.ResearchMethods.Dto
{
    [AutoMap(typeof(ResearchMethod))]
    public class ResearchMethodDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }
        public bool IsEditable { get; set; }

        public virtual ResearchMethodDto Parent { get; set; }
        public virtual IEnumerable<ResearchMethodDto> Children { get; set; }
    }
}
