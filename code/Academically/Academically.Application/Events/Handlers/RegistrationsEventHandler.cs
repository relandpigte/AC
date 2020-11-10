using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs;
using Academically.BackgroundJobs.JobArgs;
using Academically.Entities;

namespace Academically.Events.Handlers
{
    public class RegistrationsEventHandler :
        BackgroundJobEventHandler,
        IAsyncEventHandler<EntityCreatedEventData<Registration>>
    {
        public RegistrationsEventHandler(IBackgroundJobManager backgroundJobManager) : base(backgroundJobManager)
        {
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Registration> eventData)
        {
            await EnqueueAsync<SendRegistrationEmailJob, SendRegistrationEmailJobArgs>(new SendRegistrationEmailJobArgs()
            {
                RegistrationId = eventData.Entity.Id,
                EmailAddress = eventData.Entity.EmailAddress,
            });
        }
    }
}
