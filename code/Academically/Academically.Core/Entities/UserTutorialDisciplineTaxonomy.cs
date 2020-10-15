using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyUserTutorialDisciplineTaxonomies")]
    public class UserTutorialDisciplineTaxonomy : Entity<Guid>
    {
        public Guid TutorialId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }
        [ForeignKey("TutorialId")] 
        public UserTutorial UserTutorial { get; set; }
        [ForeignKey("DisciplineTaxonomyId")]
        public DisciplineTaxonomy DisciplineTaxonomy { get; set; }
    }
}
