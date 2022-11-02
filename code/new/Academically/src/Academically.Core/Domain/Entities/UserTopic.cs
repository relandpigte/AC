using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserTopics")]
    public class UserTopic : CreationAuditedEntity<Guid>
    {
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }

        public UserTopicType Type { get; set; }

        [ForeignKey("DisciplineTaxonomyId")]
        public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
    }
}
