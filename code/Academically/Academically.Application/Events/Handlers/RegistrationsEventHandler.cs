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
    public class RegistrationsEventHandler :
        IAsyncEventHandler<EntityCreatedEventData<Registration>>,
        ITransientDependency
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public RegistrationsEventHandler(IBackgroundJobManager backgroundJobManager)
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Registration> eventData)
        {
            await _backgroundJobManager.EnqueueAsync<SendRegistrationEmailJob, SendRegistrationEmailJobArgs>(new SendRegistrationEmailJobArgs()
            {
                RegistrationId = eventData.Entity.Id,
                EmailAddress = eventData.Entity.EmailAddress,
            });
        }
    }
}
