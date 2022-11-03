using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Academically.Services.Posts.Dto
{
    [AutoMapTo(typeof(Post))]
    public class CreatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid? SpaceId { get; set; }
        public PostType Type { get; set; }
        public IEnumerable<Guid> Topics { get; set; }
        public IEnumerable<IFormFile> Attachments { get; set; }
    }
}

