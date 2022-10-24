using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.UserTopics.Dto
{
    [AutoMapTo(typeof(UserTopic))]
    public class CreateUserTopicDto
	{
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }
    }
}

