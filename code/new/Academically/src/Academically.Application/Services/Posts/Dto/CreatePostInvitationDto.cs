using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.Posts.Dto
{
    [AutoMapTo(typeof(PostInvitation))]
    public class CreatePostInvitationDto
    {
        public Guid PostId { get; set; }
        public long UserId { get; set; }
        public long CreatorUserId { get; set; }
    }
}
