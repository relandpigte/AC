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
    public class CourseRatingsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<CourseRating>>,
        IAsyncEventHandler<EntityUpdatedEventData<CourseRating>>,
        IAsyncEventHandler<EntityDeletedEventData<CourseRating>>
    {
        private readonly IAbpSession _abpSession;
        private readonly INotificationsAppService _notificationsAppService;

        public CourseRatingsEventHandler(IAbpSession abpSession,
            INotificationsAppService notificationsAppService
        )
        {
            _abpSession = abpSession;
            _notificationsAppService = notificationsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<CourseRating> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            await _notificationsAppService.Create(new CreateNotificationDto()
            {
                UserId = eventData.Entity.ServiceOwnerId.Value,
                ActorId = currentUserId,
                Action = NotificationAction.Review,
                Target = NotificationTarget.Course,
                ReferenceId = eventData.Entity.CourseId,
                Url = $"app/course/{eventData.Entity.CourseId}/review"
        });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<CourseRating> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<CourseRating> eventData)
        {
        }
    }
}
