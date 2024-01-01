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
    public class VideosEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Video>>,
        IAsyncEventHandler<EntityUpdatedEventData<Video>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public VideosEventHandler(
            IBackgroundJobManager backgroundJobManager
        )
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Video> eventData)
        {
            if (eventData.Entity.Status == VideoStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<VideoFollowerNotificationJob, VideoFollowerNotificationJobArgs>(new VideoFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Video> eventData)
        {
            if (eventData.Entity.Status == VideoStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<VideoFollowerNotificationJob, VideoFollowerNotificationJobArgs>(new VideoFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }
    }
}
