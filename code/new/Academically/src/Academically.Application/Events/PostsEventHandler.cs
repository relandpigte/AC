using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Posts.Dto;
using System.Threading.Tasks;
using Academically.Services.Posts;
using Abp.BackgroundJobs;
using Academically.BackgroundJobs;
using Academically.BackgroundJobs.Dto;

namespace Academically.Events
{
    public class PostsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Post>>,
        IAsyncEventHandler<EntityUpdatedEventData<Post>>,
        IAsyncEventHandler<EntityDeletedEventData<Post>>
    {
        private readonly Abp.ObjectMapping.IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IPostsAppService _postsAppService;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public PostsEventHandler(Abp.ObjectMapping.IObjectMapper objectMapper,
            IHubManager hubManager,
            IPostsAppService postsAppService,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _postsAppService = postsAppService;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Post> eventData)
        {
            var postDto = await _postsAppService.GetAsync(eventData.Entity.Id, null, false, true);
            await _hubManager.NotifyUsersForPostCreated(postDto);
            await _backgroundJobManager.EnqueueAsync<PostUserNotificationJob, PostUserNotificationJobArgs>(new PostUserNotificationJobArgs(){ PostId = eventData.Entity.Id });
            await _backgroundJobManager.EnqueueAsync<PostFollowerNotificationJob, PostFollowerNotificationJobArgs>(new PostFollowerNotificationJobArgs() { PostId = eventData.Entity.Id });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Post> eventData)
        {
            var postDto = await _postsAppService.GetAsync(eventData.Entity.Id, null, false, true);
            await _hubManager.NotifyUsersForPostUpdated(postDto);
            await _backgroundJobManager.EnqueueAsync<PostUserNotificationJob, PostUserNotificationJobArgs>(new PostUserNotificationJobArgs() { PostId = eventData.Entity.Id });
            await _backgroundJobManager.EnqueueAsync<PostFollowerNotificationJob, PostFollowerNotificationJobArgs>(new PostFollowerNotificationJobArgs() { PostId = eventData.Entity.Id });
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Post> eventData)
        {
            await _hubManager.NotifyUsersForPostDeleted(_objectMapper.Map<PostDto>(eventData.Entity));
        }
    }
}
