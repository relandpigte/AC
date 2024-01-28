using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities;

[Table("EventTopics")]
public class EventTopic : CreationAuditedEntity<Guid>
{
    public Guid EventId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }

    [ForeignKey("EventId")]
    public virtual Event Event { get; set; }

    [ForeignKey("DisciplineTaxonomyId")]
    public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
}