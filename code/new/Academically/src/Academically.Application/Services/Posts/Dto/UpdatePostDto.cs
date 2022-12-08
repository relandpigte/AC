using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Posts.Dto
{
    [AutoMapTo(typeof(Post))]
    public class UpdatePostDto : EntityDto<Guid>
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid? SpaceId { get; set; }
        public Guid? ServiceId { get; set; }
        public PostType Type { get; set; }
        public bool IsDeleted { get; set; }

    }
}
