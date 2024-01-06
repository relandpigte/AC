using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Academically.BackgroundJobs.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;
using System.Threading.Tasks;

namespace Academically.BackgroundJobs
{
    public class PostUserNotificationJob : AsyncBackgroundJob<PostUserNotificationJobArgs>, ITransientDependency
    {
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public PostUserNotificationJob(
            IRepository<Post, Guid> postsRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _postsRepository = postsRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(PostUserNotificationJobArgs args)
        {
            var post = await this._postsRepository.FirstOrDefaultAsync(args.PostId);
            if (post == null) return;
            if (post.IsServiceDiscussion) return;

            var discussion = post.ParentId.HasValue ? await this._postsRepository.FirstOrDefaultAsync(post.ParentId.Value) : null;
            if (discussion != null)
            {
                await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                {
                    UserId = discussion.CreatorUserId.GetValueOrDefault(),
                    ActorId = post.CreatorUserId.Value,
                    Action = NotificationAction.Post,
                    Target = NotificationTarget.Post,
                    ReferenceId = post.Id,
                    SourceId = post.Id,
                    Url = $"app/community/discussion/{discussion.Id}"
                }, BackgroundJobPriority.High);
            }
        }
    }
}
