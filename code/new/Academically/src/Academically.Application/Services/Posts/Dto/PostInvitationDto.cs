using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;

namespace Academically.Services.Posts.Dto
{
    [AutoMapFrom(typeof(PostInvitation))]
    public class PostInvitationDto : CreationAuditedEntity<Guid>
    {
        public Guid PostId { get; set; }
        public long UserId { get; set; }
        public virtual PostDto Post { get; set; }
        public virtual UserDto User { get; set; }
        public virtual UserDto CreatorUser { get; set; }
    }
}
