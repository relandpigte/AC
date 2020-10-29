using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Services.DisciplineTaxonomyStudyLevels.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserProfiles.Dto
{
    [AutoMapFrom(typeof(UserDisciplineTaxonomyStudyLevel))]
    public class GetUserDisciplineTaxonomyStudyLevelDto : EntityDto<int>
    {
        public int LevelId { get; set; }
        public string Name { get; set; }
    }
}
