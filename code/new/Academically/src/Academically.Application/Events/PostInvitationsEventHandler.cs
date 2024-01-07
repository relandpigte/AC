using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.Domain.Entities;
using System.Threading.Tasks;
using Academically.Domain.Enums;
using Abp.BackgroundJobs;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;
using System;

namespace Academically.Events
{
    public class PostInvitationsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<PostInvitation>>,
        IAsyncEventHandler<EntityUpdatedEventData<PostInvitation>>,
        IAsyncEventHandler<EntityDeletedEventData<PostInvitation>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public PostInvitationsEventHandler(
            IBackgroundJobManager backgroundJobManager
        )
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<PostInvitation> eventData)
        {
            var userGuid = $"{AppConsts.DefaultTempGuid}{($"{eventData.Entity.UserId}".PadLeft(12, 'f'))}";
            await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
            {
                UserId = eventData.Entity.UserId,
                ActorId = eventData.Entity.CreatorUserId.Value,
                Action = NotificationAction.Invite,
                Target = NotificationTarget.Discussion,
                ReferenceId = new Guid(userGuid),
                SourceId = eventData.Entity.PostId,
            }, BackgroundJobPriority.High);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<PostInvitation> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<PostInvitation> eventData)
        {
        }
    }
}
