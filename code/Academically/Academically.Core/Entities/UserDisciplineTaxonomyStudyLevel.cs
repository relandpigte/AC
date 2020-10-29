using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyUserDisciplineTaxonomyStudyLevels")]
    public class UserDisciplineTaxonomyStudyLevel : Entity<int>
    {
        public int DisciplineTaxonomyStudyLevelId { get; set; }
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }
    }
}
