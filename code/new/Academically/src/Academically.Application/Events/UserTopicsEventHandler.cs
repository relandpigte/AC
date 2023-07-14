using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.UserTopics.Dto;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class UserTopicsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<UserTopic>>,
        IAsyncEventHandler<EntityUpdatedEventData<UserTopic>>,
        IAsyncEventHandler<EntityDeletedEventData<UserTopic>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;

        public UserTopicsEventHandler(IObjectMapper objectMapper, IHubManager hubManager)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<UserTopic> eventData)
        {
            await _hubManager.NotifyUsersForUserTopicCreated(_objectMapper.Map<UserTopicDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<UserTopic> eventData)
        {
            await _hubManager.NotifyUsersForUserTopicUpdated(_objectMapper.Map<UserTopicDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<UserTopic> eventData)
        {
            await _hubManager.NotifyUsersForUserTopicDeleted(_objectMapper.Map<UserTopicDto>(eventData.Entity));
        }
    }
}
