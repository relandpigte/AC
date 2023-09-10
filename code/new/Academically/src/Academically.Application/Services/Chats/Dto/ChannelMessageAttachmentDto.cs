using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;

namespace Academically.Services.Chats.Dto
{
    [AutoMapFrom(typeof(ChannelMessageAttachment))]
    public class ChannelMessageAttachmentDto : CreationAuditedEntity<Guid>
    {
        public Guid ChannelMessageId { get; set; }
        public Guid DocumentId { get; set; }
        public DocumentDto Document { get; set; }
        public string DocumentUrl { get; set; }
    }
}