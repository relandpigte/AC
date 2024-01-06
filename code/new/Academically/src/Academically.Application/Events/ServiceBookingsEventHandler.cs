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
using System.Dynamic;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Academically.Events
{
    public class ServiceBookingsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<ServiceBooking>>,
        IAsyncEventHandler<EntityUpdatedEventData<ServiceBooking>>,
        IAsyncEventHandler<EntityDeletedEventData<ServiceBooking>>
    {
        private readonly IAbpSession _abpSession;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ServiceBookingsEventHandler(IAbpSession abpSession,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _abpSession = abpSession;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ServiceBooking> eventData)
        {
            if (eventData.Entity.Type.Value != ServicesType.Coaching) return;

            try
            {
                var additionalData = new ExpandoObject();
                additionalData.TryAdd("bookingDateTime", eventData.Entity.BookingDateTime);

                await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                {
                    UserId = eventData.Entity.OwnerId,
                    ActorId = eventData.Entity.CreatorUserId.Value,
                    Action = NotificationAction.Book,
                    Target = getNotificationTarget(eventData.Entity.Type.Value),
                    ReferenceId = eventData.Entity.ReferenceId,
                    SourceId = eventData.Entity.Id,
                    Url = getServiceUrl(eventData.Entity.Type.Value, eventData.Entity.ReferenceId),
                    AdditionalData = JsonConvert.SerializeObject(additionalData)
                });
            }
            catch (ArgumentNullException ex)
            {}
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ServiceBooking> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ServiceBooking> eventData)
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
