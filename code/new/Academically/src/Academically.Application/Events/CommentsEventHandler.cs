using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Comments.Dto;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class CommentsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<Comment>>,
        IAsyncEventHandler<EntityUpdatedEventData<Comment>>,
        IAsyncEventHandler<EntityDeletedEventData<Comment>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;

        public CommentsEventHandler(IObjectMapper objectMapper, IHubManager hubManager)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Comment> eventData)
        {
            await _hubManager.NotifyUsersForCommentCreated(_objectMapper.Map<CommentDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Comment> eventData)
        {
            await _hubManager.NotifyUsersForCommentUpdated(_objectMapper.Map<CommentDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Comment> eventData)
        {
            await _hubManager.NotifyUsersForCommentDeleted(_objectMapper.Map<CommentDto>(eventData.Entity));
        }
    }
}
