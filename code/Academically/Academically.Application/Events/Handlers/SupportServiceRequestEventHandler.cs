using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs;
using Academically.BackgroundJobs.JobArgs;
using Academically.Entities;

namespace Academically.Events.Handlers
{
    public class SupportServiceRequestEventHandler :
        IAsyncEventHandler<EntityCreatedEventData<SupportServiceRequest>>,
        ITransientDependency
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public SupportServiceRequestEventHandler(IBackgroundJobManager backgroundJobManager)
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<SupportServiceRequest> eventData)
        {
            await _backgroundJobManager.EnqueueAsync<SendSupportServiceRequestEmailJob, SendSupportServiceRequestEmailJobArgs>(new SendSupportServiceRequestEmailJobArgs()
            {
                Name = eventData.Entity.Name,
                Comments = eventData.Entity.Comments,
                ParentId = eventData.Entity.ParentId,
                UserId = eventData.Entity.CreatorUserId.Value,
            });
        }
    }
}
