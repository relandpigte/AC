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
    public class ChannelArchiveEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityUpdatedEventData<ChannelArchive>>,
        IAsyncEventHandler<EntityDeletedEventData<ChannelArchive>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IChatsAppService _chatsAppService;

        public ChannelArchiveEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IChatsAppService chatsAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _chatsAppService = chatsAppService;
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ChannelArchive> eventData)
        {
            var channel = await _chatsAppService.GetChannel(eventData.Entity.ChannelId);
            await _hubManager.NotifyUsersForChannelArchive(channel);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ChannelArchive> eventData)
        {
            var channel = await _chatsAppService.GetChannel(eventData.Entity.ChannelId);
            await _hubManager.NotifyUsersForChannelUnarchive(channel);
        }
    }
}
