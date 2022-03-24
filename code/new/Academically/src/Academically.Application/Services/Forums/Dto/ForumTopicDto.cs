using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Topics.Dto;

namespace Academically.Services.Forums.Dto
{
    [AutoMapFrom(typeof(ForumTopic))]
    public class ForumTopicDto
	{
        public Guid ForumId { get; set; }
        public Guid TopicId { get; set; }

        public TopicDto Topic { get; set; }
    }
}

