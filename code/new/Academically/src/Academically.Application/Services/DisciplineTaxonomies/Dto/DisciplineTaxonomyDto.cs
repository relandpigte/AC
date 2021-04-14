using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.DisciplineTaxonomies.Dto
{
    [AutoMap(typeof(DisciplineTaxonomy))]
    public class DisciplineTaxonomyDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }
    }
}
