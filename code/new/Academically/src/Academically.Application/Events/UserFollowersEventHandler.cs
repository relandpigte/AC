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
using System;

namespace Academically.Events
{
    public class UserFollowersEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<UserFollower>>,
        IAsyncEventHandler<EntityUpdatedEventData<UserFollower>>,
        IAsyncEventHandler<EntityDeletedEventData<UserFollower>>
    {
        private readonly IAbpSession _abpSession;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public UserFollowersEventHandler(IAbpSession abpSession,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _abpSession = abpSession;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<UserFollower> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            var userGuid = $"{AppConsts.DefaultTempGuid}{($"{eventData.Entity.UserId}".PadLeft(12, 'f'))}";
            await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
            {
                UserId = eventData.Entity.UserId,
                ActorId = currentUserId,
                Action = NotificationAction.Follow,
                Target = NotificationTarget.User,
                ReferenceId = new Guid(userGuid),
                SourceId = eventData.Entity.Id,
            }, BackgroundJobPriority.High);

            await _backgroundJobManager.EnqueueAsync<FollowingFollowerNotificationJob, FollowingFollowerNotificationJobArgs>(new FollowingFollowerNotificationJobArgs { UserFollowerId = eventData.Entity.Id });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<UserFollower> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<UserFollower> eventData)
        {
        }
    }
}
