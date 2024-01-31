using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.Videos.Dto;

[AutoMapFrom(typeof(VideoTopic))]
public class VideoTopicDto : CreationAuditedEntity<Guid>
{
    public Guid VideoId { get; set; }
    public Guid DisciplineTaxonomyId { get; set; }
    public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
}

