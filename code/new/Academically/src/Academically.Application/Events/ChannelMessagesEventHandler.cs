using System.Linq;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using System.Threading.Tasks;
using Abp.Runtime.Session;
using Academically.Domain.Enums;
using Academically.Services.Chats;
using Academically.Services.Chats.Dto;
using Academically.Services.Notifications;
using Academically.Services.Notifications.Dto;
using Microsoft.AspNetCore.Http;

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
        private readonly INotificationsAppService _notificationsAppService;
        private readonly IAbpSession _abpSession;

        public ChannelMessagesEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IChatsAppService chatsAppService,
            INotificationsAppService notificationsAppService,
            IAbpSession abpSession)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _chatsAppService = chatsAppService;
            _notificationsAppService = notificationsAppService;
            _abpSession = abpSession;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ChannelMessage> eventData)
        {
            var channelMessageDto = await _chatsAppService.GetChannelMessage(eventData.Entity.Id);
            channelMessageDto.Channel = await _chatsAppService.GetChannel(eventData.Entity.ChannelId);
            await _hubManager.NotifyUsersForChannelMessageCreated(channelMessageDto);

            var currentUserId = _abpSession.GetUserId();
            var channelMember = channelMessageDto.Channel.Members
                .Where(m => !m.UserId.Equals(currentUserId))
                .Select(m => m.UserId)
                .FirstOrDefault();

            await _chatsAppService.UnarchiveChannel(eventData.Entity.ChannelId, channelMember);
            await _notificationsAppService.Create(new CreateNotificationDto()
            {
                UserId = channelMember,
                ActorId = currentUserId,
                Action = NotificationAction.Chat,
                Target = NotificationTarget.Chat,
                ReferenceId = channelMessageDto.ChannelId,
                SourceId = channelMessageDto.Id,
                Url = $"app/chat?channel={channelMessageDto.ChannelId}"
            });
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
