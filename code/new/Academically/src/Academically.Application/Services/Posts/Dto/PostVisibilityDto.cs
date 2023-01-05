using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Abp.Timing;
using Academically.Domain.Entities;
using System;
using System.Text.Json.Serialization;

namespace Academically.Services.Posts.Dto
{
    [AutoMapTo(typeof(PostVisibility))]
    public class PostVisibilityDto : CreationAuditedEntity<Guid>
    {
        public Guid PostId { get; set; }
        public bool IsHidden { get; set; }
    }
}
