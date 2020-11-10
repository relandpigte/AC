using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs;
using Academically.BackgroundJobs.JobArgs;
using Academically.Entities;

namespace Academically.Events.Handlers
{
    public class ResearchMethodRequestEventHandler :
        BackgroundJobEventHandler,
        IAsyncEventHandler<EntityCreatedEventData<ResearchMethodRequest>>
    {
        public ResearchMethodRequestEventHandler(IBackgroundJobManager backgroundJobManager) : base(backgroundJobManager)
        {
        }

        public async Task HandleEventAsync(EntityCreatedEventData<ResearchMethodRequest> eventData)
        {
            await EnqueueAsync<SendResearchMethodRequestEmailJob, SendResearchMethodRequestEmailJobArgs>(new SendResearchMethodRequestEmailJobArgs()
            {
                Name = eventData.Entity.Name,
                Comments = eventData.Entity.Comments,
                ParentId = eventData.Entity.ParentId,
                UserId = eventData.Entity.CreatorUserId.Value,
            });
        }
    }
}
