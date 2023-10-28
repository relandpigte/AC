using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using System.Threading.Tasks;
using Academically.Services.Notifications.Dto;

namespace Academically.Events
{
    public class NotificationsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<Notification>>,
        IAsyncEventHandler<EntityUpdatedEventData<Notification>>,
        IAsyncEventHandler<EntityDeletedEventData<Notification>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;


        public NotificationsEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager
        )
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Notification> eventData)
        {
            await _hubManager.NotifyUsersForNewNotification(_objectMapper.Map<NotificationDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Notification> eventData)
        {
            await _hubManager.NotifyUsersForUpdatedNotification(_objectMapper.Map<NotificationDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Notification> eventData)
        {
            await _hubManager.NotifyUsersForDeletedNotification(this._objectMapper.Map<NotificationDto>(eventData.Entity));
        }
    }
}
