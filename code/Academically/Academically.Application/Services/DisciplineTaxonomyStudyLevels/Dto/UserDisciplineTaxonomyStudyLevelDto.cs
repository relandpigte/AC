using Abp.AutoMapper;
using Abp.Domain.Entities;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.DisciplineTaxonomyStudyLevels.Dto
{
    [AutoMap(typeof(UserDisciplineTaxonomyStudyLevel))]
    public class UserDisciplineTaxonomyStudyLevelDto : Entity<int>
    {
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }
    }
}
