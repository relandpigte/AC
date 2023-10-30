using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Runtime.Session;
using Academically.Domain.Entities;
using Academically.Services.Notifications;
using System.Threading.Tasks;
using Academically.Domain.Enums;
using Academically.Services.Notifications.Dto;
using System;

namespace Academically.Events
{
    public class EventRatingsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<EventRating>>,
        IAsyncEventHandler<EntityUpdatedEventData<EventRating>>,
        IAsyncEventHandler<EntityDeletedEventData<EventRating>>
    {
        private readonly IAbpSession _abpSession;
        private readonly INotificationsAppService _notificationsAppService;

        public EventRatingsEventHandler(IAbpSession abpSession,
            INotificationsAppService notificationsAppService
        )
        {
            _abpSession = abpSession;
            _notificationsAppService = notificationsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<EventRating> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            await _notificationsAppService.Create(new CreateNotificationDto()
            {
                UserId = eventData.Entity.ServiceOwnerId.Value,
                ActorId = currentUserId,
                Action = NotificationAction.Review,
                Target = getNotificationTarget(eventData.Entity.ServiceType.Value),
                ReferenceId = eventData.Entity.EventId,
                Url = $"/app/events/{eventData.Entity.EventId}/about"
            });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<EventRating> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<EventRating> eventData)
        {
        }

        private NotificationTarget getNotificationTarget(ServicesType type)
        {
            switch (type)
            {
                case ServicesType.Event:
                    return NotificationTarget.Broadcast;
                default:
                    return NotificationTarget.Workshop;
            }
        }

    }
}
