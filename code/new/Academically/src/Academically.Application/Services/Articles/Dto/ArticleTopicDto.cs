using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.Articles.Dto;

[AutoMapFrom(typeof(ArticleTopic))]
public class ArticleTopicDto : CreationAuditedEntity<Guid>
{
    public Guid EventId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }
    public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
}