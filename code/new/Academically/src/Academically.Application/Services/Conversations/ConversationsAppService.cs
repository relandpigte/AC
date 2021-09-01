using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Conversations.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Conversations
{
    public class ConversationsAppService : AcademicallyAppServiceBase, IConversationsAppService
    {
        private readonly IRepository<ConversationGroup, Guid> _conversationGroupsRepository;

        public ConversationsAppService(
            IRepository<ConversationGroup, Guid> conversationGroupsRepository
            )
        {
            _conversationGroupsRepository = conversationGroupsRepository;
        }

        public async Task<IEnumerable<ConversationDto>> GetAll(Guid projectId)
        {
            var conversations = await _conversationGroupsRepository.GetAll()
                .Where(e => e.ProjectId == projectId)
                .Include(e => e.Conversations)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .SelectMany(e => e.Conversations)
                .OrderBy(e => e.CreationTime)
                .Select(e => ObjectMapper.Map<ConversationDto>(e))
                .ToListAsync();
            return conversations;
        }
    }
}
