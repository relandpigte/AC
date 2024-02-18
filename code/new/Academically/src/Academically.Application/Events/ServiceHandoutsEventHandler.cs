using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.Domain.Entities;
using System.Threading.Tasks;
using Academically.Hubs;
using Abp.ObjectMapping;
using Academically.Services.CoachingResources.Dto;
using Academically.Services.Services.Dto;

namespace Academically.Events
{
    public class ServiceHandoutsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<ServiceHandout>>,
        IAsyncEventHandler<EntityUpdatedEventData<ServiceHandout>>,
        IAsyncEventHandler<EntityDeletedEventData<ServiceHandout>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;

        public ServiceHandoutsEventHandler(
            IObjectMapper objectMapper,
            IHubManager hubManager
        )
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ServiceHandout> eventData)
        {
            await _hubManager.NotifyUsersForServiceHandoutCreated(_objectMapper.Map<ServiceHandoutDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ServiceHandout> eventData)
        {
            await _hubManager.NotifyUsersForServiceHandoutUpdated(_objectMapper.Map<ServiceHandoutDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ServiceHandout> eventData)
        {
            await _hubManager.NotifyUsersForServiceHandoutDeleted(_objectMapper.Map<ServiceHandoutDto>(eventData.Entity));
        }
    }
}
