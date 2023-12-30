using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Academically.BackgroundJobs.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Notifications;
using Academically.Services.Notifications.Dto;
using Academically.Services.Posts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.BackgroundJobs
{
    public class PostFollowerNotificationJob : AsyncBackgroundJob<PostFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IPostsAppService _postsAppService;
        private readonly INotificationsAppService _notificationsAppService;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;

        public PostFollowerNotificationJob(
            IPostsAppService postsAppService,
            INotificationsAppService notificationsAppService,
            IRepository<UserFollower, Guid> userFollowersRepository
        )
        {
            _postsAppService = postsAppService;
            _notificationsAppService = notificationsAppService;
            _userFollowersRepository = userFollowersRepository;
        }

        public override async Task ExecuteAsync(PostFollowerNotificationJobArgs args)
        {
            var post = args.Post;
            if (post == null) return;

            if (post.ParentId.HasValue) return;

            var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == post.CreatorUserId);
            foreach (var follower in followers)
            {
                await this._notificationsAppService.Create(new CreateNotificationDto()
                {
                    UserId = follower.CreatorUserId.GetValueOrDefault(),
                    ActorId = post.CreatorUserId.Value,
                    Action = this.GetNotificationActionByPostType(post.Type),
                    Target = this.GetNotificationTargetByPostType(post.Type),
                    ReferenceId = post.Id,
                    SourceId = post.Id,
                    Url = $"app/community/post"
                });
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
