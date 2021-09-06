using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Conversations.Dto;

namespace Academically.Services.Conversations
{
    public interface IConversationsAppService : IApplicationService
    {
        Task<IEnumerable<ConversationDto>> GetAll(Guid projectId);
        Task<IEnumerable<ConversationGroupDto>> GetGroups(Guid? projectId);
    }
}
