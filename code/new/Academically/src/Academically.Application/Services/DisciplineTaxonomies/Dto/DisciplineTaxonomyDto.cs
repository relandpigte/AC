using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;

namespace Academically.Services.DisciplineTaxonomies.Dto
{
    [AutoMap(typeof(DisciplineTaxonomy))]
    public class DisciplineTaxonomyDto : EntityDto<Guid>, IHasCreationTime
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }
        public bool IsEditable { get; set; }
        public DateTime CreationTime { get; set; }
        public DisciplineTaxonomyDto Parent { get; set; }
        public IEnumerable<DisciplineTaxonomyDto> Children { get; set; }
    }
}
