using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class EventsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Event>>,
        IAsyncEventHandler<EntityUpdatedEventData<Event>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public EventsEventHandler(
            IBackgroundJobManager backgroundJobManager
        )
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Event> eventData)
        {
            if (eventData.Entity.Status == EventStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<EventFollowerNotificationJob, EventFollowerNotificationJobArgs>(new EventFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Event> eventData)
        {
            if (eventData.Entity.Status == EventStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<EventFollowerNotificationJob, EventFollowerNotificationJobArgs>(new EventFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }
    }
}
