using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Runtime.Session;
using Academically.Domain.Entities;
using System.Threading.Tasks;
using Academically.Domain.Enums;
using Abp.BackgroundJobs;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;

namespace Academically.Events
{
    public class EventRatingsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<EventRating>>,
        IAsyncEventHandler<EntityUpdatedEventData<EventRating>>,
        IAsyncEventHandler<EntityDeletedEventData<EventRating>>
    {
        private readonly IAbpSession _abpSession;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public EventRatingsEventHandler(IAbpSession abpSession,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _abpSession = abpSession;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<EventRating> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
            {
                UserId = eventData.Entity.ServiceOwnerId.Value,
                ActorId = currentUserId,
                Action = NotificationAction.Review,
                Target = getNotificationTarget(eventData.Entity.ServiceType.Value),
                ReferenceId = eventData.Entity.EventId,
                SourceId = eventData.Entity.Id,
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
