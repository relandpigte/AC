using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class ArticlesEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Article>>,
        IAsyncEventHandler<EntityUpdatedEventData<Article>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ArticlesEventHandler(
            IBackgroundJobManager backgroundJobManager
        )
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Article> eventData)
        {
            if (eventData.Entity.Status == ArticleStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<ArticleFollowerNotificationJob, ArticleFollowerNotificationJobArgs>(new ArticleFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Article> eventData)
        {
            if (eventData.Entity.Status == ArticleStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<ArticleFollowerNotificationJob, ArticleFollowerNotificationJobArgs>(new ArticleFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }
    }
}
