using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

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
        public Guid? ParentId { get; set; }
        public bool IsDeleted { get; set; }
        public IEnumerable<Guid> Topics { get; set; }
        public IEnumerable<string> NewTopics { get; set; }
        public IEnumerable<IFormFile> Attachments { get; set; }
    }
}
