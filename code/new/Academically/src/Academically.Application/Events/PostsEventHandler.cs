using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Posts.Dto;
using System.Threading.Tasks;
using Academically.Services.Posts;

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

        public PostsEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IPostsAppService postsAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _postsAppService = postsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Post> eventData)
        {
            var postDto = await _postsAppService.GetAsync(eventData.Entity.Id);
            await _hubManager.NotifyUsersForPostCreated(postDto);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Post> eventData)
        {
            var postDto = await _postsAppService.GetAsync(eventData.Entity.Id);
            await _hubManager.NotifyUsersForPostUpdated(postDto);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Post> eventData)
        {
            await _hubManager.NotifyUsersForPostDeleted(_objectMapper.Map<PostDto>(eventData.Entity));
        }
    }
}
