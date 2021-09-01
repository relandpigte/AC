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

        public ConversationsHub(
            IRepository<Conversation, Guid> conversationsRepository
            )
        {
            _conversationsRepository = conversationsRepository;
        }

        public async Task SendConversation(IEnumerable<long> userIds, ConversationDto input)
        {
            foreach (var userId in userIds)
            {
                input.CreationTime = Clock.Now;
                await Clients.User(userId.ToString()).SendAsync("conversationSent", input);
                input.CreatorUser = null;
                var conversation = new Conversation();
                ObjectMapper.Map(input, conversation);
                await _conversationsRepository.InsertAsync(conversation);
            }
        }
    }
}
