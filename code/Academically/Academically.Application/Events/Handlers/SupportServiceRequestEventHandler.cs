using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs;
using Academically.BackgroundJobs.JobArgs;
using Academically.Entities;

namespace Academically.Events.Handlers
{
    public class SupportServiceRequestEventHandler :
        BackgroundJobEventHandler,
        IAsyncEventHandler<EntityCreatedEventData<SupportServiceRequest>>
    {
        public SupportServiceRequestEventHandler(IBackgroundJobManager backgroundJobManager) : base(backgroundJobManager)
        {
        }

        public async Task HandleEventAsync(EntityCreatedEventData<SupportServiceRequest> eventData)
        {
            await EnqueueAsync<SendSupportServiceRequestEmailJob, SendSupportServiceRequestEmailJobArgs>(new SendSupportServiceRequestEmailJobArgs()
            {
                Name = eventData.Entity.Name,
                Comments = eventData.Entity.Comments,
                ParentId = eventData.Entity.ParentId,
                UserId = eventData.Entity.CreatorUserId.Value,
            });
        }
    }
}
