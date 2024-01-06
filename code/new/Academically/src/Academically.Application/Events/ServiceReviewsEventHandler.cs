using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.Domain.Entities;
using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;

namespace Academically.Events
{
    public class ServiceReviewsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<ServiceReview>>,
        IAsyncEventHandler<EntityUpdatedEventData<ServiceReview>>,
        IAsyncEventHandler<EntityDeletedEventData<ServiceReview>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ServiceReviewsEventHandler(
            IBackgroundJobManager backgroundJobManager
        )
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ServiceReview> eventData)
        {
            await _backgroundJobManager.EnqueueAsync<ServiceReviewFollowerNotificationJob, ServiceReviewFollowerNotificationJobArgs>(new ServiceReviewFollowerNotificationJobArgs { ServiceReviewId = eventData.Entity.Id });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ServiceReview> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ServiceReview> eventData)
        {
        }
    }
}
