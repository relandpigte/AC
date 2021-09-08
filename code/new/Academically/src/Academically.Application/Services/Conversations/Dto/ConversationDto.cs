using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;

namespace Academically.Services.Conversations.Dto
{
    [AutoMap(typeof(Conversation))]
    public class ConversationDto : EntityDto<Guid?>
    {
        public string Message { get; set; }
        public Guid ConversationGroupId { get; set; }
        public DateTime CreationTime { get; set; }
        public long CreatorUserId { get; set; }

        public UserDto CreatorUser { get; set; }

        public bool HasFiles { get; set; }
        public List<ConversationDocumentDto> ConversationDocuments { get; set; }
    }
}
