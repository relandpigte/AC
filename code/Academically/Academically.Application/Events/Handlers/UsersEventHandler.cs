using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs;
using Academically.BackgroundJobs.JobArgs;

namespace Academically.Events.Handlers
{
    public class UsersEventHandler :
        IAsyncEventHandler<EntityCreatedEventData<UserLoginAttempt>>,
        ITransientDependency
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public UsersEventHandler(IBackgroundJobManager backgroundJobManager)
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<UserLoginAttempt> eventData)
        {
            if (eventData.Entity.UserId.HasValue && eventData.Entity.Result == AbpLoginResultType.Success)
            {
                await _backgroundJobManager.EnqueueAsync<SaveUserLastLoginTimeJob, SaveUserLastLoginTimeJobArgs>(new SaveUserLastLoginTimeJobArgs()
                {
                    UserId = eventData.Entity.UserId.Value,
                    LastLoginTime = eventData.Entity.CreationTime,
                });
            }
        }
    }
}
