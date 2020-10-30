using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;

namespace Academically.Services.SupportServices.Dto
{
    [AutoMap(typeof(SupportService))]
    public class SupportServiceDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }
        public bool IsEditable { get; set; }

        public virtual SupportServiceDto Parent { get; set; }
        public virtual IEnumerable<SupportServiceDto> Children { get; set; }
    }
}
