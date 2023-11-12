using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Services.Comments.Dto;
using Academically.Services.Articles.Dto;
using Academically.Services.Coachings.Dto;
using Academically.Services.Courses.Dto;
using Academically.Services.Events.Dto;
using Academically.Services.Videos.Dto;
using System;
using System.Threading.Tasks;
using Academically.Domain.Services.Documents;
using Academically.Services.Notifications.Dto;
using Academically.Services.Reactions.Dto;
using Academically.Services.Comments;
using Academically.Services.Notifications;
using Academically.Services.Posts;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;

namespace Academically.Events
{
    public class CommentsEventHandler : ITransientDependency, 
        IAsyncEventHandler<EntityCreatedEventData<Comment>>,
        IAsyncEventHandler<EntityUpdatedEventData<Comment>>,
        IAsyncEventHandler<EntityDeletedEventData<Comment>>
    {
        private readonly IObjectMapper _objectMapper;
        private readonly IHubManager _hubManager;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Video, Guid> _videoRepository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IPostsAppService _postsAppService;
        private readonly ICommentsAppService _commentsAppService;
        private readonly INotificationsAppService _notificationsAppService;

        public CommentsEventHandler(IObjectMapper objectMapper,
            IHubManager hubManager,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Course, Guid> coursesRepository,
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Video, Guid> videoRepository,
            IRepository<Event, Guid> eventRepository,
            IDocumentsDomainService documentsDomainService,
            IPostsAppService postsAppService,
            ICommentsAppService commentsAppService,
            INotificationsAppService notificationsAppService)
        {
            _objectMapper = objectMapper;
            _hubManager = hubManager;
            _articlesRepository = articlesRepository;
            _coursesRepository = coursesRepository;
            _coachingRepository = coachingRepository;
            _videoRepository = videoRepository;
            _eventRepository = eventRepository;
            _documentsDomainService = documentsDomainService;
            _postsAppService = postsAppService;
            _commentsAppService = commentsAppService;
            _notificationsAppService = notificationsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Comment> eventData)
        {
            var comment = _objectMapper.Map<CommentDto>(eventData.Entity);
            await FillInService(comment);
            await _hubManager.NotifyUsersForCommentCreated(comment);
            await this.SendUserNotifications(comment);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Comment> eventData)
        {
            var comment = _objectMapper.Map<CommentDto>(eventData.Entity);
            await FillInService(comment);
            await _hubManager.NotifyUsersForCommentUpdated(comment);
            await this.SendUserNotifications(comment);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Comment> eventData)
        {
            await _hubManager.NotifyUsersForCommentDeleted(_objectMapper.Map<CommentDto>(eventData.Entity));
        }


        private async Task FillInService(CommentDto comment)
        {
            if (comment == null || !comment.ServiceId.HasValue)
                return;

            switch (comment.ServiceType)
            {
                case Domain.Enums.ServicesType.Event:
                case Domain.Enums.ServicesType.Workshop:
                    var event_ = await _eventRepository.GetAsync(comment.ServiceId.Value);
                    comment.Event = _objectMapper.Map<EventDto>(event_);
                    if (comment.Event.ThumbnailDocumentId.HasValue)
                        comment.Event.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(comment.Event.ThumbnailDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Course:
                    var course = await _coursesRepository.GetAsync(comment.ServiceId.Value);
                    comment.Course = _objectMapper.Map<CourseDto>(course);
                    if (comment.Course.ImageDocumentId.HasValue)
                        comment.Course.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Tutorial:
                    var video = await _videoRepository.GetAsync(comment.ServiceId.Value);
                    comment.Video = _objectMapper.Map<VideoDto>(video);
                    if (comment.Video.ThumbnailDocumentId.HasValue)
                        comment.Video.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(comment.Video.ThumbnailDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Article:
                    var article = await _articlesRepository.GetAsync(comment.ServiceId.Value);
                    comment.Article = _objectMapper.Map<ArticleDto>(article);
                    if (comment.Article.ThumbnailDocumentId.HasValue)
                        comment.Article.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(comment.Article.ThumbnailDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Coaching:
                    var coaching = await _coachingRepository.GetAsync(comment.ServiceId.Value);
                    comment.Coaching = _objectMapper.Map<CoachingDto>(coaching);
                    if (comment.Coaching.ThumbnailDocumentId.HasValue)
                        comment.Coaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                    break;
                default:
                    break;
            }
        }

        private async Task SendUserNotifications(CommentDto commentEvent)
        {
            Guid referenceId = new Guid();
            long userId = 0;

            var post = await this._postsAppService.GetAsync(new Guid(commentEvent.ReferenceId));
            var comment = commentEvent.ParentId.HasValue ? await this._commentsAppService.GetAsync(commentEvent.ParentId.Value) : null;
            var url = "";
            var postUrl = "app/community/post/";
            var discussionUrl = "app/community/discussion/";

            if (comment != null)
            {
                referenceId = comment.Id;
                userId = comment.CreatorUserId.GetValueOrDefault();
                var parentPost = await this._postsAppService.GetAsync(new Guid(comment.ReferenceId));
                if (parentPost != null && parentPost.Parent != null && parentPost.Parent.Type == PostType.Discussion)
                    url = $"{discussionUrl}{parentPost.ParentId}";
                else
                    url = $"{postUrl}{comment.ReferenceId}";
            }
            else if (post != null)
            {
                referenceId = post.Id;
                userId = post.CreatorUserId.GetValueOrDefault();
                if (post.Parent != null && post.Parent.Type == PostType.Discussion)
                    url = $"{discussionUrl}{post.ParentId}";
                else
                    url = $"{postUrl}{post.Id}";
            }

            await this._notificationsAppService.Create(new CreateNotificationDto()
            {
                UserId = userId,
                ActorId = commentEvent.CreatorUserId.Value,
                Action = await this.getNotificationAction(post, comment),
                Target = await this.getNotificationTarget(post, comment),
                ReferenceId = referenceId,
                SourceId = commentEvent.Id,
                Url = url
            });
        }

        private async Task<NotificationAction> getNotificationAction(PostDto post, CommentDto comment)
        {
            if (post != null)
            {
                if (comment != null)
                {
                    return NotificationAction.Reply;
                }
                else
                {
                    var type = post.Type;
                    switch (type)
                    {
                        case PostType.Question:
                            return NotificationAction.Answer;
                    }
                }
            }
            return NotificationAction.Comment;
        }

        private async Task<NotificationTarget> getNotificationTarget(PostDto post, CommentDto comment)
        {
            if (comment != null)
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
            else
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

        }
    }
}
