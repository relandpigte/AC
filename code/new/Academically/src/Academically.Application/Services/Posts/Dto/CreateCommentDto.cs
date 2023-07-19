using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Academically.Services.Posts.Dto
{
    [AutoMapTo(typeof(Comment))]
    public class CreateCommentDto
    {
        public string ReferenceId { get; set; }
        public Guid? ParentId { get; set; }
        public string Body { get; set; }
        public long? TaggedId { get; set; }
        public Guid? ServiceId { get; set; }
        public ServicesType? ServiceType { get; set; }
        public IEnumerable<IFormFile> Attachments { get; set; }

    }
}

