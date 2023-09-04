using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using System.Threading.Tasks;
using Academically.Services.Chats;

namespace Academically.Events
{
    public class ChannelMembersEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityUpdatedEventData<ChannelMember>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IChatsAppService _chatsAppService;

        public ChannelMembersEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IChatsAppService chatsAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _chatsAppService = chatsAppService;
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ChannelMember> eventData)
        {
            var channel = await _chatsAppService.GetChannel(eventData.Entity.ChannelId);
            await _hubManager.NotifyUsersForChannelMemberTyping(channel);
        }
    }
}
