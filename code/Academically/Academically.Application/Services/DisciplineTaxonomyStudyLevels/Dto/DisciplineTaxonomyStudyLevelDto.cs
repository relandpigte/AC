using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.DisciplineTaxonomyStudyLevels.Dto
{
    [AutoMap(typeof(UserDisciplineTaxonomyStudyLevel))]
    public class DisciplineTaxonomyStudyLevelDto  : EntityDto<int>
    {
        public string Name { get; set; }
    }
}
