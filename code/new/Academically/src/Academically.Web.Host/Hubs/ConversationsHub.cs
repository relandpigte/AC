using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Services.Conversations.Dto;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Web.Host.Hubs
{
    public class ConversationsHub : AbpHubBase, ITransientDependency
    {
        private readonly IRepository<Conversation, Guid> _conversationsRepository;
        private readonly IRepository<ConversationGroup, Guid> _conversationGroupsRepository;

        public ConversationsHub(
            IRepository<Conversation, Guid> conversationsRepository,
            IRepository<ConversationGroup, Guid> conversationGroupsRepository
            )
        {
            _conversationsRepository = conversationsRepository;
            _conversationGroupsRepository = conversationGroupsRepository;
        }

        public async Task SendConversation(IEnumerable<long> userIds, ConversationDto input)
        {
            var creatorUser = input.CreatorUser;
            input.CreationTime = Clock.Now;
            input.CreatorUser = null;
            var conversation = new Conversation();
            ObjectMapper.Map(input, conversation);
            var id = await _conversationsRepository.InsertAndGetIdAsync(conversation);
            input.Id = id;
            input.CreatorUser = creatorUser;

            var conversationGroup = await _conversationGroupsRepository.GetAsync(input.ConversationGroupId);
            conversationGroup.LastConversationCreationTime = conversation.CreationTime;
            conversationGroup.LastConversationCreatorUserId = conversation.CreatorUserId;
            conversationGroup.LastConversationMessage = conversation.Message.Length > 200
                ? conversation.Message.Substring(0, 200)
                : conversation.Message; ;
            await _conversationGroupsRepository.UpdateAsync(conversationGroup);

            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("conversationSent", input);
            }
        }

        public async Task SendConversationFiles(IEnumerable<long> userIds, Guid conversationId, IEnumerable<ConversationDocumentDto> documents)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("conversationFilesSent", conversationId, documents);
            }
        }
    }
}
