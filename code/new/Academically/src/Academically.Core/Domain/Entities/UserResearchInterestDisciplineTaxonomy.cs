using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("UserResearchInterestDisciplineTaxonomies")]
    public class UserResearchInterestDisciplineTaxonomy : Entity<Guid>
    {
        public Guid UserResearchInterestId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }

        [ForeignKey("DisciplineTaxonomyId")]
        public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
    }
}
