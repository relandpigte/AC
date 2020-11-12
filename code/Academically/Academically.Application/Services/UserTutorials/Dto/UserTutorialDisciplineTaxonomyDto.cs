using Abp.AutoMapper;
using Academically.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserTutorials.Dto
{
    [AutoMapFrom(typeof(UserTutorialDisciplineTaxonomy))]
    public class UserTutorialDisciplineTaxonomyDto
    {
        public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
    }
}
