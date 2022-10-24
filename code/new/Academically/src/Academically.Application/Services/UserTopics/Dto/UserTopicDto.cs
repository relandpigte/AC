using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.UserTopics.Dto
{
    [AutoMap(typeof(UserTopic))]
    public class UserTopicDto : EntityDto<Guid?>
    {
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }

        public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
    }
}
