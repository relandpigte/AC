using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;

namespace Academically.Services.Videos.Dto;

[AutoMapFrom(typeof(VideoAttachment))]
public class VideoAttachmentDto : CreationAuditedEntity<Guid>
{
    public Guid VideoId { get; set; }
    public int DisplayOrder { get; set; }
    public Guid DocumentId { get; set; }
    public DocumentDto Document { get; set; }
    public string DocumentUrl { get; set; }
}