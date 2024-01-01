using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Runtime.Session;
using Academically.Domain.Entities;
using System.Threading.Tasks;
using Academically.Domain.Enums;
using System;
using Abp.BackgroundJobs;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;

namespace Academically.Events
{
    public class ServiceRatingsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<ServiceRating>>,
        IAsyncEventHandler<EntityUpdatedEventData<ServiceRating>>,
        IAsyncEventHandler<EntityDeletedEventData<ServiceRating>>
    {
        private readonly IAbpSession _abpSession;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ServiceRatingsEventHandler(IAbpSession abpSession,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _abpSession = abpSession;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ServiceRating> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
            {
                UserId = eventData.Entity.ServiceOwnerId.Value,
                ActorId = currentUserId,
                Action = NotificationAction.Review,
                Target = getNotificationTarget(eventData.Entity.ServiceType.Value),
                ReferenceId = eventData.Entity.ServiceId,
                SourceId = eventData.Entity.Id,
                Url = getServiceUrl(eventData.Entity.ServiceType.Value, eventData.Entity.ServiceId)
            });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ServiceRating> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ServiceRating> eventData)
        {
        }

        private NotificationTarget getNotificationTarget(ServicesType type)
        {
            switch (type)
            {
                case ServicesType.Article:
                    return NotificationTarget.Article;
                case ServicesType.Event:
                    return NotificationTarget.Broadcast;
                case ServicesType.Coaching:
                    return NotificationTarget.Coaching;
                case ServicesType.Course:
                    return NotificationTarget.Course;
                case ServicesType.Tutorial:
                    return NotificationTarget.Tutorial;
                default:
                    return NotificationTarget.Workshop;
            }
        }

        private string getServiceUrl(ServicesType type, Guid id)
        {
            switch (type)
            {
                case ServicesType.Article:
                    return $"/app/articles/student-portal/{id}";
                case ServicesType.Event:
                    return $"/app/events/{id}/about";
                case ServicesType.Coaching:
                    return $"app/coaching/{id}/review";
                case ServicesType.Course:
                    return $"app/course/{id}/review";
                case ServicesType.Tutorial:
                    return $"app/videos/student-portal/{id}";
                default:
                    return $"/app/events/{id}/about";
            }
        }
    }
}
