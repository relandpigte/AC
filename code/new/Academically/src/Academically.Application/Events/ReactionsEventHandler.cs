using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Reactions.Dto;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class ReactionsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<Reaction>>,
        IAsyncEventHandler<EntityUpdatedEventData<Reaction>>,
        IAsyncEventHandler<EntityDeletedEventData<Reaction>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;

        public ReactionsEventHandler(IObjectMapper objectMapper, IHubManager hubManager)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Reaction> eventData)
        {
            await _hubManager.NotifyUsersForReactionCreated(_objectMapper.Map<ReactionDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Reaction> eventData)
        {
            await _hubManager.NotifyUsersForReactionUpdated(_objectMapper.Map<ReactionDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Reaction> eventData)
        {
            await _hubManager.NotifyUsersForReactionDeleted(_objectMapper.Map<ReactionDto>(eventData.Entity));
        }
    }
}
