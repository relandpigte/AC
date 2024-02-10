using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities;

[Table("CoachingTopics")]
public class CoachingTopic : CreationAuditedEntity<Guid>
{
    public Guid CoachingId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }

    [ForeignKey("CoachingId")]
    public virtual Coaching Coaching { get; set; }

    [ForeignKey("DisciplineTaxonomyId")]
    public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
}