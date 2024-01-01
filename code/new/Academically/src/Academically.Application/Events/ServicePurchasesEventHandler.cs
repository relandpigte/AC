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
    public class ServicePurchasesEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<ServicePurchase>>,
        IAsyncEventHandler<EntityUpdatedEventData<ServicePurchase>>,
        IAsyncEventHandler<EntityDeletedEventData<ServicePurchase>>
    {
        private readonly IAbpSession _abpSession;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ServicePurchasesEventHandler(IAbpSession abpSession,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _abpSession = abpSession;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ServicePurchase> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
            {
                UserId = eventData.Entity.OwnerId.Value,
                ActorId = currentUserId,
                Action = getNotificationAction(eventData.Entity.Type.Value),
                Target = getNotificationTarget(eventData.Entity.Type.Value),
                ReferenceId = eventData.Entity.ReferenceId.Value,
                SourceId = eventData.Entity.ReferenceId.Value,
                Url = getServiceUrl(eventData.Entity.Type.Value, eventData.Entity.ReferenceId.Value)
            });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ServicePurchase> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ServicePurchase> eventData)
        {
        }

        private NotificationAction getNotificationAction(ServicesType type)
        {
            switch(type)
            {
                case ServicesType.Course:
                    return NotificationAction.Enroll;
                default:
                    return NotificationAction.Purchase;
            }
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
                    return $"app/coaching/{id}/about";
                case ServicesType.Course:
                    return $"app/course/{id}/about";
                case ServicesType.Tutorial:
                    return $"app/videos/student-portal/{id}";
                default:
                    return $"/app/events/{id}/about";
            }
        }
    }
}
