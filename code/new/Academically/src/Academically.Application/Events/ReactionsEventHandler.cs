using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Hubs;
using Academically.Services.Comments;
using Academically.Services.Comments.Dto;
using Academically.Services.Notifications;
using Academically.Services.Notifications.Dto;
using Academically.Services.Posts;
using Academically.Services.Posts.Dto;
using Academically.Services.Reactions.Dto;
using System;
using System.Linq;
using System.Threading.Tasks;
using Academically.Services.UserFollowers;

namespace Academically.Events
{
    public class ReactionsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<Reaction>>,
        IAsyncEventHandler<EntityUpdatedEventData<Reaction>>,
        IAsyncEventHandler<EntityDeletedEventData<Reaction>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IPostsAppService _postsAppService;
        private readonly ICommentsAppService _commentsAppService;
        private readonly INotificationsAppService _notificationsAppService;
        private readonly IUserFollowersAppService _userFollowersAppService;

        public ReactionsEventHandler(
            IObjectMapper objectMapper,
            IHubManager hubManager,
            IPostsAppService postsAppService,
            ICommentsAppService commentsAppService,
            INotificationsAppService notificationsAppService,
            IUserFollowersAppService userFollowersAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _postsAppService = postsAppService;
            _commentsAppService = commentsAppService;
            _notificationsAppService = notificationsAppService;
            _userFollowersAppService = userFollowersAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Reaction> eventData)
        {
            var reaction = _objectMapper.Map<ReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForReactionCreated(reaction);
            await this.SendUserNotifications(reaction);
            await SendFollowerNotifications(reaction);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Reaction> eventData)
        {
            var reaction = _objectMapper.Map<ReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForReactionUpdated(reaction);
            await this.SendUserNotifications(reaction);
            await SendFollowerNotifications(reaction);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Reaction> eventData)
        {
            await _hubManager.NotifyUsersForReactionDeleted(_objectMapper.Map<ReactionDto>(eventData.Entity));
        }

        private async Task SendUserNotifications(ReactionDto reaction)
        {
            Guid referenceId = new Guid();
            Guid sourceId = new Guid();
            long userId = 0;

            var post = await this._postsAppService.GetAsync(new Guid(reaction.ReferenceId));
            var comment = await this._commentsAppService.GetAsync(new Guid(reaction.ReferenceId));
            var url = "";
            var postUrl = "app/community/post/";
            var discussionUrl = "app/community/discussion/";

            if (post != null)
            {
                referenceId = post.Id;
                sourceId = post.Id;
                userId = post.CreatorUserId.GetValueOrDefault();
                if (post.Parent != null && post.Parent.Type == PostType.Discussion)
                    url = $"{discussionUrl}{post.ParentId}";
                else
                    url = $"{postUrl}{post.Id}";
            }
            else if (comment != null)
            {
                var parentPost = await this._postsAppService.GetAsync(new Guid(comment.ReferenceId));
                referenceId = parentPost.Id;
                sourceId = comment.Id;
                userId = comment.CreatorUserId.GetValueOrDefault();
                if (parentPost.Parent != null && parentPost.Parent.Type == PostType.Discussion)
                    url = $"{discussionUrl}{parentPost.ParentId}";
                else
                    url = $"{postUrl}{comment.ReferenceId}";
            }

            await _notificationsAppService.Create(new CreateNotificationDto
            {
                UserId = userId,
                ActorId = reaction.CreatorUserId,
                Action = await this.getNotificationAction(reaction.Type),
                Target = await this.getNotificationTarget(post, comment),
                ReferenceId = referenceId,
                SourceId = sourceId,
                Url = url
            });
        }

        private async Task<NotificationAction> getNotificationAction(ReactionType type)
        {
            switch (type)
            {
                case ReactionType.Like:
                    return NotificationAction.Like;
                default:
                    return NotificationAction.React;
            }
        }

        private async Task<NotificationTarget> getNotificationTarget(PostDto post, CommentDto comment)
        {
            if (post != null)
            {
                var type = post.Type;
                var parentType = post.Parent?.Type;
                switch (type)
                {
                    case PostType.Question:
                        return NotificationTarget.Question;
                    case PostType.QuickPost:
                        if (parentType != null)
                        {
                            if (parentType == PostType.Question)
                                return NotificationTarget.Answer;
                        }
                        return NotificationTarget.Post;
                    default:
                        return NotificationTarget.Post;
                }
            }
            else
            {
                if (comment.Parent != null)
                {
                    
                    return NotificationTarget.Reply;
                }
                else
                {
                    var reference = await this._postsAppService.GetAsync(new Guid(comment.ReferenceId));
                    if (reference != null)
                    {
                        if (reference.Type == PostType.Question) return NotificationTarget.Answer;
                    }
                }
                return NotificationTarget.Comment;
            }
            
        }
        
        private async Task SendFollowerNotifications(ReactionDto reaction)
        {
            var followers = await _userFollowersAppService.GetFollowers();
            var userIds = followers.Select(x => x.CreatorUserId).ToList();
            
            var post = await _postsAppService.GetAsync(new Guid(reaction.ReferenceId));
            if (post != null)
            {
                if (post.ParentId.HasValue) return;

                await Parallel.ForEachAsync(userIds, async (userId, token) =>
                {
                    if (userId != null)
                        await _notificationsAppService.Create(new CreateNotificationDto
                        {
                            UserId = userId.Value,
                            ActorId = reaction.CreatorUserId,
                            Action = await getNotificationAction(reaction.Type),
                            Target = await getNotificationTarget(post, null),
                            ReferenceId = post.Id,
                            SourceId = post.Id,
                            Url = $"app/community/post/{post.Id}"
                        });

                });
            }
            
            var comment = await _commentsAppService.GetAsync(new Guid(reaction.ReferenceId));
            if (comment != null)
            {
                var parentPost = await _postsAppService.GetAsync(new Guid(comment.ReferenceId));
                if (parentPost.ParentId.HasValue) return;
                
                await Parallel.ForEachAsync(userIds, async (userId, token) =>
                {
                    if (userId != null)
                        await _notificationsAppService.Create(new CreateNotificationDto
                        {
                            UserId = userId.Value,
                            ActorId = reaction.CreatorUserId,
                            Action = await getNotificationAction(reaction.Type),
                            Target = await getNotificationTarget(null, comment),
                            ReferenceId = parentPost.Id,
                            SourceId = comment.Id,
                            Url = $"app/community/post/{parentPost.Id}"
                        });

                });
            }
        }
    }
}
