using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Services.Conversations.Dto;
using Microsoft.AspNetCore.SignalR;

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
            foreach (var userId in userIds)
            {
                input.CreationTime = Clock.Now;
                var fullMessage = input.Message;
                var shortMessage = input.Message.Length > 200
                    ? input.Message.Substring(0, 200)
                    : input.Message;
                input.Message = shortMessage;
                await Clients.User(userId.ToString()).SendAsync("conversationSent", input);
                input.CreatorUser = null;
                var conversation = new Conversation();
                ObjectMapper.Map(input, conversation);
                conversation.Message = fullMessage;
                await _conversationsRepository.InsertAsync(conversation);

                var conversationGroup = await _conversationGroupsRepository.GetAsync(input.ConversationGroupId);
                conversationGroup.LastConversationCreationTime = conversation.CreationTime;
                conversationGroup.LastConversationCreatorUserId = conversation.CreatorUserId;
                conversationGroup.LastConversationMessage = shortMessage;
                await _conversationGroupsRepository.UpdateAsync(conversationGroup);
            }
        }
    }
}
