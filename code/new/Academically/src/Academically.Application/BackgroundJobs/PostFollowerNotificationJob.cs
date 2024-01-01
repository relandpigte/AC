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
    public class PostFollowerNotificationJob : AsyncBackgroundJob<PostFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public PostFollowerNotificationJob(
            IRepository<Post, Guid> postsRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _postsRepository = postsRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(PostFollowerNotificationJobArgs args)
        {
            var post = await this._postsRepository.FirstOrDefaultAsync(args.PostId);
            if (post == null) return;

            if (post.ParentId.HasValue) return;

            var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == post.CreatorUserId);
            foreach (var follower in followers)
            {
                await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                {
                    UserId = follower.CreatorUserId.GetValueOrDefault(),
                    ActorId = post.CreatorUserId.Value,
                    Action = this.GetNotificationActionByPostType(post.Type),
                    Target = this.GetNotificationTargetByPostType(post.Type),
                    ReferenceId = post.Id,
                    SourceId = post.Id,
                    Url = $"app/community/post"
                }, BackgroundJobPriority.High);
            }
        }

        private NotificationAction GetNotificationActionByPostType(PostType postType)
        {
            switch (postType)
            {
                case PostType.QuickPost:
                    return NotificationAction.Create;
                case PostType.Question:
                    return NotificationAction.Ask;
                default:
                    return NotificationAction.Start;
            }
        }

        private NotificationTarget GetNotificationTargetByPostType(PostType postType)
        {
            switch (postType)
            {
                case PostType.QuickPost:
                    return NotificationTarget.Post;
                case PostType.Question:
                    return NotificationTarget.Question;
                default:
                    return NotificationTarget.Discussion;
            }
        }
    }
}
