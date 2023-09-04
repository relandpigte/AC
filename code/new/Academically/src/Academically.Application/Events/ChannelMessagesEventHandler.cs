using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using System.Threading.Tasks;
using Academically.Services.Chats;
using Academically.Services.Chats.Dto;

namespace Academically.Events
{
    public class ChannelMessagesEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<ChannelMessage>>,
        IAsyncEventHandler<EntityUpdatedEventData<ChannelMessage>>,
        IAsyncEventHandler<EntityDeletedEventData<ChannelMessage>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IChatsAppService _chatsAppService;

        public ChannelMessagesEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IChatsAppService chatsAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _chatsAppService = chatsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ChannelMessage> eventData)
        {
            var channelMessageDto = await _chatsAppService.GetChannelMessage(eventData.Entity.Id);
            channelMessageDto.Channel = await _chatsAppService.GetChannel(eventData.Entity.ChannelId);
            await _hubManager.NotifyUsersForChannelMessageCreated(channelMessageDto);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ChannelMessage> eventData)
        {
            var channelMessageDto = await _chatsAppService.GetChannelMessage(eventData.Entity.Id);
            channelMessageDto.Channel = await _chatsAppService.GetChannel(eventData.Entity.ChannelId);
            await _hubManager.NotifyUsersForChannelMessageUpdated(channelMessageDto);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ChannelMessage> eventData)
        {
            await _hubManager.NotifyUsersForChannelMessageDeleted(_objectMapper.Map<ChannelMessageDto>(eventData.Entity));
        }
    }
}
