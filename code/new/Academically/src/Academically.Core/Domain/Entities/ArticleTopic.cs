using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities;

[Table("ArticleTopics")]
public class ArticleTopic : CreationAuditedEntity<Guid>
{
    public Guid ArticleId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }

    [ForeignKey("ArticleId")]
    public virtual Article Article { get; set; }

    [ForeignKey("DisciplineTaxonomyId")]
    public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
}