using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities;

[Table("VideoTopics")]
public class VideoTopic : CreationAuditedEntity<Guid>
{
    public Guid VideoId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }

    [ForeignKey("VideoId")]
    public virtual Video Video { get; set; }

    [ForeignKey("DisciplineTaxonomyId")]
    public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
}