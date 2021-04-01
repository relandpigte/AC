using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.UserResearchInterests.Dto
{
    [AutoMap(typeof(UserResearchInterestDisciplineTaxonomy))]
    public class UserResearchInterestDisciplineTaxonomyDto : EntityDto<Guid?>
    {
        public Guid UserResearchInterestId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }

        public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
    }
}
