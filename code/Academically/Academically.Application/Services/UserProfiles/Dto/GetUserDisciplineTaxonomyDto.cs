using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.UserProfiles.Dto
{
    [AutoMapFrom(typeof(UserDisciplineTaxonomy))]
    public class GetUserDisciplineTaxonomyDto : EntityDto<Guid>
    {
        public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
    }
}
