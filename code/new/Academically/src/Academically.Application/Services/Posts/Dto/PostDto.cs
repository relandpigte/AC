using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Posts.Dto
{
    [AutoMapFrom(typeof(Post))]
    public class PostDto : FullAuditedEntityDto<Guid>
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid? SpaceId { get; set; }
        public PostType Type { get; set; }

        public UserDto CreatorUser { get; set; }
    }
}
