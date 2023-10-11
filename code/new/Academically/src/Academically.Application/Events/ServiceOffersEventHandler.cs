using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Posts;
using Academically.Services.Services;
using Academically.Services.Services.Dto;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class ServiceOffersEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<ServiceOffer>>,
        IAsyncEventHandler<EntityUpdatedEventData<ServiceOffer>>,
        IAsyncEventHandler<EntityDeletedEventData<ServiceOffer>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IServicesAppService _serviceAppService;
        private readonly IPostsAppService _postsAppService;

        public ServiceOffersEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IServicesAppService serviceAppService,
            IPostsAppService postsAppService
        )
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _serviceAppService = serviceAppService;
            _postsAppService = postsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ServiceOffer> eventData)
        {
            await _hubManager.NotifyUsersForServiceOfferCreated(_objectMapper.Map<ServiceOfferDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<ServiceOffer> eventData)
        {
            await _hubManager.NotifyUsersForServiceOfferUpdated(_objectMapper.Map<ServiceOfferDto>(eventData.Entity));
        }

        public async Task HandleEventAsync(EntityDeletedEventData<ServiceOffer> eventData)
        {
            await _hubManager.NotifyUsersForServiceOfferDeleted(_objectMapper.Map<ServiceOfferDto>(eventData.Entity));
        }
    }
}
