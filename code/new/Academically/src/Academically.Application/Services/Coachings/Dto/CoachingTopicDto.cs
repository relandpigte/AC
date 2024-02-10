using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.Coachings.Dto;

[AutoMapFrom(typeof(CoachingTopic))]
public class CoachingTopicDto : CreationAuditedEntity<Guid>
{
    public Guid CoachingId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }
    public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
}