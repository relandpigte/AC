using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.BackgroundJobs;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs;
using Academically.BackgroundJobs.JobArgs;

namespace Academically.Events.Handlers
{
    public class UsersEventHandler :
        BackgroundJobEventHandler,
        IAsyncEventHandler<EntityCreatedEventData<UserLoginAttempt>>
    {
        public UsersEventHandler(IBackgroundJobManager backgroundJobManager) : base(backgroundJobManager)
        {
        }

        public async Task HandleEventAsync(EntityCreatedEventData<UserLoginAttempt> eventData)
        {
            if (eventData.Entity.UserId.HasValue && eventData.Entity.Result == AbpLoginResultType.Success)
            {
                await EnqueueAsync<SaveUserLastLoginTimeJob, SaveUserLastLoginTimeJobArgs>(new SaveUserLastLoginTimeJobArgs()
                {
                    UserId = eventData.Entity.UserId.Value,
                    LastLoginTime = eventData.Entity.CreationTime,
                });
            }
        }
    }
}
