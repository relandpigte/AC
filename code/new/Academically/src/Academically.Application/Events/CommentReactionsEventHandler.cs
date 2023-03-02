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
    public class CommentReactionsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<CommentReaction>>,
        IAsyncEventHandler<EntityUpdatedEventData<CommentReaction>>,
        IAsyncEventHandler<EntityDeletedEventData<CommentReaction>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;

        public CommentReactionsEventHandler(IObjectMapper objectMapper, IHubManager hubManager)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<CommentReaction> eventData)
        {
            await _hubManager.NotifyUsersForCommentReactionCreated(_objectMapper.Map<CommentReactionDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<CommentReaction> eventData)
        {
            await _hubManager.NotifyUsersForCommentReactionUpdated(_objectMapper.Map<CommentReactionDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<CommentReaction> eventData)
        {
            await _hubManager.NotifyUsersForCommentReactionDeleted(_objectMapper.Map<CommentReactionDto>(eventData.Entity));
        }
    }
}
