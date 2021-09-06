using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Projects.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Conversations.Dto
{
    [AutoMap(typeof(ConversationGroup))]
    public class ConversationGroupDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid? ProjectId { get; set; }
        public DateTime? LastConversationCreationTime { get; set; }
        public long? LastConversationCreatorUserId { get; set; }
        public string LastConversationMessage { get; set; }

        public ProjectDto Project { get; set; }

        public int UnseenCount { get; set; }
    }
}
