using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Forums.Dto
{
    [AutoMapTo(typeof(ForumReply))]
    public class CreateForumReplyDto
	{
        public string Message { get; set; }
        public Guid ForumId { get; set; }
    }
}

