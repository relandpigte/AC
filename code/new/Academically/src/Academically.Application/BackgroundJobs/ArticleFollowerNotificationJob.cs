using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Academically.BackgroundJobs.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.BackgroundJobs
{
    public class ArticleFollowerNotificationJob : AsyncBackgroundJob<ArticleFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ArticleFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<Article, Guid> articlesRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _articlesRepository = articlesRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(ArticleFollowerNotificationJobArgs args)
        {
            var article = await this._articlesRepository.FirstOrDefaultAsync(args.ServiceId);
            if (article == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                if (article.Status == ArticleStatus.Published)
                {
                    var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == article.CreatorUserId);
                    var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();

                    foreach (var userId in userIds)
                    {
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = article.CreatorUserId.Value,
                            Action = NotificationAction.Create,
                            Target = NotificationTarget.Article,
                            ReferenceId = article.Id,
                            SourceId = article.Id,
                            Url = $"app/articles/student-portal/{article.Id}"
                        }, BackgroundJobPriority.High);
                    }
                }

                await uow.CompleteAsync();
            }
        }
    }
}
