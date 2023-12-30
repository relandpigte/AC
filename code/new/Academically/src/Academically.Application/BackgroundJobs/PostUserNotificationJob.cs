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
    public class PostUserNotificationJob : AsyncBackgroundJob<PostUserNotificationJobArgs>, ITransientDependency
    {
        private readonly IPostsAppService _postsAppService;
        private readonly INotificationsAppService _notificationsAppService;

        public PostUserNotificationJob(
            IPostsAppService postsAppService,
            INotificationsAppService notificationsAppService
        )
        {
            _postsAppService = postsAppService;
            _notificationsAppService = notificationsAppService;
        }

        public override async Task ExecuteAsync(PostUserNotificationJobArgs args)
        {
            var post = args.Post;
            if (post == null) return;

            var discussion = post.ParentId.HasValue ? await this._postsAppService.GetAsync(post.ParentId.Value) : null;
            if (discussion != null)
            {
                await this._notificationsAppService.Create(new CreateNotificationDto()
                {
                    UserId = discussion.CreatorUserId.GetValueOrDefault(),
                    ActorId = post.CreatorUserId.Value,
                    Action = NotificationAction.Post,
                    Target = NotificationTarget.Post,
                    ReferenceId = post.Id,
                    SourceId = post.Id,
                    Url = $"app/community/discussion/{discussion.Id}"
                });
            }
        }
    }
}
