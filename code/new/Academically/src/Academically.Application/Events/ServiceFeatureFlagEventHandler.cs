using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.Domain.Entities;
using System.Threading.Tasks;
using Academically.Hubs;
using Academically.Services.Services;

namespace Academically.Events
{
    public class ServiceFeatureFlagEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityUpdatedEventData<ServiceFeatureFlag>>
    {
        private readonly IHubManager _hubManager;
        private readonly IServicesAppService _servicesAppService;

        public ServiceFeatureFlagEventHandler(
            IHubManager hubManager,
            IServicesAppService servicesAppService
        )
        {
            _hubManager = hubManager;
            _servicesAppService = servicesAppService;
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ServiceFeatureFlag> eventData)
        {
            var settings = await _servicesAppService.GetFeatureFlags(eventData.Entity.ReferenceId);
            await _hubManager.NotifyUsersForEventSettingsUpdated(settings);
        }
    }
}
