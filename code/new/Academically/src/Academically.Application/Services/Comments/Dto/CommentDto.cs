using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;

namespace Academically.Services.Comments.Dto
{
    [AutoMap(typeof(Comment))]
    public class CommentDto : EntityDto<Guid>
    {
        public string Body { get; set; }
        public Guid? ParentId { get; set; }
        public string ReferenceId { get; set; }
        public DateTime CreationTime { get; set; }

        public int ReplyCount { get; set; }

        public CommentDto Parent { get; set; }
        public UserDto CreatorUser { get; set; }

        public IEnumerable<CommentDto> Children { get; set; }
        public IEnumerable<CommentReactionDto> CommentReactions { get; set; }
    }
}
