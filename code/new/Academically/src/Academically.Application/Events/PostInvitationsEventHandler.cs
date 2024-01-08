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
using Academically.Services.Posts;

namespace Academically.Events
{
    public class PostInvitationsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<PostInvitation>>,
        IAsyncEventHandler<EntityUpdatedEventData<PostInvitation>>,
        IAsyncEventHandler<EntityDeletedEventData<PostInvitation>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;
        private readonly IPostsAppService _postsAppService;

        public PostInvitationsEventHandler(
            IBackgroundJobManager backgroundJobManager,
            IPostsAppService postsAppService)
        {
            _backgroundJobManager = backgroundJobManager;
            _postsAppService = postsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<PostInvitation> eventData)
        {
            var postDto = await _postsAppService.GetAsync(eventData.Entity.PostId, null, false, true);
            var userGuid = $"{AppConsts.DefaultTempGuid}{($"{eventData.Entity.UserId}".PadLeft(12, 'f'))}";
            
            const string postUrl = "app/community/post/";
            const string discussionUrl = "app/community/discussion/";
            
            await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
            {
                UserId = eventData.Entity.UserId,
                ActorId = eventData.Entity.CreatorUserId.Value,
                Action = NotificationAction.Invite,
                Target = PostType.Discussion == postDto.Type ? NotificationTarget.Discussion : NotificationTarget.Question,
                ReferenceId = new Guid(userGuid),
                SourceId = eventData.Entity.PostId,
                Url = postDto is { Type: PostType.Discussion } ? $"{discussionUrl}{postDto.Id}" : $"{postUrl}{postDto.Id}"
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
