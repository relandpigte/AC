using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.Events.Dto;

[AutoMapFrom(typeof(EventTopic))]
public class EventTopicDto : CreationAuditedEntity<Guid>
{
    public Guid EventId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }
    public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
}