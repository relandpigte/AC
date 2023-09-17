using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Comments.Dto;
using Academically.Services.Articles.Dto;
using Academically.Services.Coachings.Dto;
using Academically.Services.Courses.Dto;
using Academically.Services.Events.Dto;
using Academically.Services.Videos.Dto;
using System;
using System.Threading.Tasks;
using Academically.Domain.Services.Documents;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Linq;
using Academically.Services.Notifications.Dto;
using Academically.Services.Chats;
using Academically.Services.Notifications;

namespace Academically.Events
{
    public class NotificationsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<Notification>>,
        IAsyncEventHandler<EntityUpdatedEventData<Notification>>,
        IAsyncEventHandler<EntityDeletedEventData<Notification>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly INotificationsAppService _notificationsAppService;


        public NotificationsEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            INotificationsAppService notificationsAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _notificationsAppService = notificationsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Notification> eventData)
        {
            await _hubManager.NotifyUsersForNewNotification(await this._notificationsAppService.Get(eventData.Entity.Id.ToString()));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Notification> eventData)
        {
            await _hubManager.NotifyUsersForUpdatedNotification(await this._notificationsAppService.Get(eventData.Entity.Id.ToString()));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Notification> eventData)
        {
            await _hubManager.NotifyUsersForDeletedNotification(this._objectMapper.Map<NotificationDto>(eventData.Entity));
        }
    }
}
