using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyDisciplineTaxonomyStudyLevels")]
    public class DisciplineTaxonomyStudylevel : Entity<int>
    {
        public string Name { get; set; }
        public int LevelId { get; set; }
    }
}
