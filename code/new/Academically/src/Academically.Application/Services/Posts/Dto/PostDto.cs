using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Articles.Dto;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Services.Posts.Dto
{
    [AutoMapFrom(typeof(Post))]
    public class PostDto : FullAuditedEntityDto<Guid>
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid? SpaceId { get; set; }
        public Guid? ServiceId { get; set; }
        public PostType Type { get; set; }
        public Guid? ParentId { get; set; }
        public UserDto CreatorUser { get; set; }
        [NotMapped]
        public AvailableServiceDto Service { get; set; }

        public IEnumerable<PostTopicDto> PostTopics { get; set; }
        public IEnumerable<PostAttachmentDto> PostAttachments { get; set; }
        public IEnumerable<PostDto> Children { get; set; }
        public IEnumerable<UserDto> Participants { get; set; }

    }
}
