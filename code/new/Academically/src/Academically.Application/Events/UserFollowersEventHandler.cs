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
    public class UserFollowersEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<UserFollower>>,
        IAsyncEventHandler<EntityUpdatedEventData<UserFollower>>,
        IAsyncEventHandler<EntityDeletedEventData<UserFollower>>
    {
        private readonly IAbpSession _abpSession;
        private readonly INotificationsAppService _notificationsAppService;

        public UserFollowersEventHandler(IAbpSession abpSession,
            INotificationsAppService notificationsAppService
        )
        {
            _abpSession = abpSession;
            _notificationsAppService = notificationsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<UserFollower> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            await _notificationsAppService.Create(new CreateNotificationDto()
            {
                UserId = eventData.Entity.UserId,
                ActorId = currentUserId,
                Action = NotificationAction.Follow,
                Target = NotificationTarget.User,
                ReferenceId = eventData.Entity.Id
            });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<UserFollower> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<UserFollower> eventData)
        {
        }
    }
}
