using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;

namespace Academically.Services.Forums.Dto
{
    [AutoMapFrom(typeof(ForumReply))]
	public class ForumReplyDto : EntityDto<Guid>
	{
        public string Message { get; set; }
        public DateTime CreationTime { get; set; }

        public UserDto CreatorUser { get; set; }
    }
}

