using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Reactions.Dto;
using System.Threading.Tasks;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;
using Abp.BackgroundJobs;

namespace Academically.Events
{
    public class ReactionsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<Reaction>>,
        IAsyncEventHandler<EntityUpdatedEventData<Reaction>>,
        IAsyncEventHandler<EntityDeletedEventData<Reaction>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ReactionsEventHandler(
            IObjectMapper objectMapper,
            IHubManager hubManager,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Reaction> eventData)
        {
            var reaction = _objectMapper.Map<ReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForReactionCreated(reaction);

            await _backgroundJobManager.EnqueueAsync<ReactionUserNotificationJob, ReactionUserNotificationJobArgs>(new ReactionUserNotificationJobArgs() { Reaction = reaction });
            await _backgroundJobManager.EnqueueAsync<ReactionFollowerNotificationJob, ReactionFollowerNotificationJobArgs>(new ReactionFollowerNotificationJobArgs() { Reaction = reaction });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Reaction> eventData)
        {
            var reaction = _objectMapper.Map<ReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForReactionUpdated(reaction);

            await _backgroundJobManager.EnqueueAsync<ReactionUserNotificationJob, ReactionUserNotificationJobArgs>(new ReactionUserNotificationJobArgs() { Reaction = reaction });
            await _backgroundJobManager.EnqueueAsync<ReactionFollowerNotificationJob, ReactionFollowerNotificationJobArgs>(new ReactionFollowerNotificationJobArgs() { Reaction = reaction });
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Reaction> eventData)
        {
            await _hubManager.NotifyUsersForReactionDeleted(_objectMapper.Map<ReactionDto>(eventData.Entity));
        }
    }
}
