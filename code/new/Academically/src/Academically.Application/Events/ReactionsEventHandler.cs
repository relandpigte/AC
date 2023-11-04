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
using System.Threading.Tasks;

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

        public ReactionsEventHandler(
            IObjectMapper objectMapper,
            IHubManager hubManager,
            IPostsAppService postsAppService,
            ICommentsAppService commentsAppService,
            INotificationsAppService notificationsAppService
        )
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _postsAppService = postsAppService;
            _commentsAppService = commentsAppService;
            _notificationsAppService = notificationsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Reaction> eventData)
        {
            var reaction = _objectMapper.Map<ReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForReactionCreated(reaction);
            await this.SendUserNotifications(reaction);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Reaction> eventData)
        {
            var reaction = _objectMapper.Map<ReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForReactionUpdated(reaction);
            await this.SendUserNotifications(reaction);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Reaction> eventData)
        {
            await _hubManager.NotifyUsersForReactionDeleted(_objectMapper.Map<ReactionDto>(eventData.Entity));
        }

        private async Task SendUserNotifications(ReactionDto reaction)
        {
            Guid referenceId = new Guid();
            long userId = 0;

            var post = await this._postsAppService.GetAsync(new Guid(reaction.ReferenceId));
            var comment = await this._commentsAppService.GetAsync(new Guid(reaction.ReferenceId));

            if (post != null)
            {
                referenceId = post.Id;
                userId = post.CreatorUserId.GetValueOrDefault();
            }
            else if (comment != null)
            {
                referenceId = comment.Id;
                userId = comment.CreatorUserId.GetValueOrDefault();
            }

            await _notificationsAppService.Create(new CreateNotificationDto
            {
                UserId = userId,
                ActorId = reaction.CreatorUserId,
                Action = await this.getNotificationAction(reaction.Type),
                Target = await this.getNotificationTarget(post, comment),
                ReferenceId = referenceId,
                Url = $"app/community/post/{referenceId}"
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
    }
}
