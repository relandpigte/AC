using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserTopics")]
    public class UserTopic : Entity<Guid>
    {
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }

        [ForeignKey("DisciplineTaxonomyId")]
        public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
    }
}
