using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;

namespace Academically.Services.Forums.Dto
{
    [AutoMapFrom(typeof(Forum))]
	public class ForumDto : EntityDto<Guid>
	{
        public string Message { get; set; }
        public DateTime CreationTime { get; set; }

        public UserDto CreatorUser { get; set; }

        public IEnumerable<ForumReplyDto> ForumReplies { get; set; }
        public IEnumerable<ForumTopicDto> ForumTopics { get; set; }
    }
}

