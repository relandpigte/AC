using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using System;

namespace Academically.Events
{
    public class CoachingsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Coaching>>,
        IAsyncEventHandler<EntityUpdatedEventData<Coaching>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CoachingsEventHandler(
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Coaching> eventData)
        {
            if (eventData.Entity.Status == CoachingStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<CoachingFollowerNotificationJob, CoachingFollowerNotificationJobArgs>(new CoachingFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Coaching> eventData)
        {
            if (eventData.Entity.Status == CoachingStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<CoachingFollowerNotificationJob, CoachingFollowerNotificationJobArgs>(new CoachingFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }
    }
}
