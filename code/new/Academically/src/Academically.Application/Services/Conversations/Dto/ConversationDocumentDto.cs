using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;
using System;

namespace Academically.Services.Conversations.Dto
{
    [AutoMap(typeof(ConversationDocument))]
    public class ConversationDocumentDto : EntityDto<Guid>
    {
        public Guid ConversationId { get; set; }
        public Guid DocumentId { get; set; }

        public ConversationDto Conversation { get; set; }
        public DocumentDto Document { get; set; }
    }
}
