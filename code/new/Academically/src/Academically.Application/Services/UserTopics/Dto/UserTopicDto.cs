using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.UserTopics.Dto
{
    [AutoMap(typeof(UserTopic))]
    public class UserTopicDto : EntityDto<Guid?>, IHasCreationTime
    {
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }
        public UserTopicType Type { get; set; }
        public DateTime CreationTime { get; set; }
        public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
    }
}
