using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using System;

namespace Academically.Services.Comments.Dto
{
    [AutoMap(typeof(CommentReaction))]
    public class CommentReactionDto : EntityDto<Guid?>
    {
        public ReactionType Type { get; set; }
        public Guid CommentId { get; set; }
        public long CreatorUserId { get; set; }
    }
}
