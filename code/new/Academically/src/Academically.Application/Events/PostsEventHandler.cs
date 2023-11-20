using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Posts.Dto;
using System.Threading.Tasks;
using Academically.Services.Posts;
using Academically.Services.Notifications.Dto;
using Academically.Services.Notifications;
using Academically.Domain.Enums;

namespace Academically.Events
{
    public class PostsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Post>>,
        IAsyncEventHandler<EntityUpdatedEventData<Post>>,
        IAsyncEventHandler<EntityDeletedEventData<Post>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IPostsAppService _postsAppService;
        private readonly INotificationsAppService _notificationsAppService;

        public PostsEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IPostsAppService postsAppService,
            INotificationsAppService notificationsAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _postsAppService = postsAppService;
            _notificationsAppService = notificationsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Post> eventData)
        {
            var postDto = await _postsAppService.GetAsync(eventData.Entity.Id, null, false, true);
            await _hubManager.NotifyUsersForPostCreated(postDto);
            await this.SendUserNotifications(postDto);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Post> eventData)
        {
            var postDto = await _postsAppService.GetAsync(eventData.Entity.Id, null, false, true);
            await _hubManager.NotifyUsersForPostUpdated(postDto);
            await this.SendUserNotifications(postDto);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Post> eventData)
        {
            await _hubManager.NotifyUsersForPostDeleted(_objectMapper.Map<PostDto>(eventData.Entity));
        }

        private async Task SendUserNotifications(PostDto post)
        {
            var discussion = post.ParentId.HasValue ? await this._postsAppService.GetAsync(post.ParentId.Value) : null;
            if (discussion != null)
            {
                await this._notificationsAppService.Create(new CreateNotificationDto()
                {
                    UserId = discussion.CreatorUserId.GetValueOrDefault(),
                    ActorId = post.CreatorUserId.Value,
                    Action = NotificationAction.Post,
                    Target = NotificationTarget.Post,
                    ReferenceId = discussion.Id,
                    SourceId = post.Id,
                    Url = $"app/community/discussion/{discussion.Id}"
                });
            }
        }
    }
}
