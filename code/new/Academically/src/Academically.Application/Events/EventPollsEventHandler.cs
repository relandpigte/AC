using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.EventPolls.Dto;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class EventPollsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<EventPoll>>,
        IAsyncEventHandler<EntityUpdatedEventData<EventPoll>>,
        IAsyncEventHandler<EntityDeletedEventData<EventPoll>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;

        public EventPollsEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager
        )
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<EventPoll> eventData)
        {
            await _hubManager.NotifyUsersForEventPollCreated(_objectMapper.Map<EventPollDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<EventPoll> eventData)
        {
            await _hubManager.NotifyUsersForEventPollUpdated(_objectMapper.Map<EventPollDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<EventPoll> eventData)
        {
            await _hubManager.NotifyUsersForEventPollDeleted(_objectMapper.Map<EventPollDto>(eventData.Entity));
        }
    }
}
