using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Academically.BackgroundJobs.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Comments.Dto;
using Academically.Services.Posts.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace Academically.BackgroundJobs
{
    public class CommentUserNotificationJob : AsyncBackgroundJob<CommentUserNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly Abp.ObjectMapping.IObjectMapper _objectMapper;
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CommentUserNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            Abp.ObjectMapping.IObjectMapper objectMapper,
            IRepository<Post, Guid> postsRepository,
            IRepository<Comment, Guid> commentsRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _objectMapper = objectMapper;
            _postsRepository = postsRepository;
            _commentsRepository = commentsRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(CommentUserNotificationJobArgs args)
        {
            var commentEvent = await this._commentsRepository.FirstOrDefaultAsync(args.CommentId);
            if (commentEvent == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                Guid referenceId = new Guid();
                long userId = 0;

                var post = await this._postsRepository.GetAll()
                    .Include(p => p.Parent)
                    .AsNoTracking()
                    .Where(p => p.Id == new Guid(commentEvent.ReferenceId))
                    .Select(p => this._objectMapper.Map<PostDto>(p))
                    .FirstOrDefaultAsync();

                var comment = commentEvent.ParentId.HasValue ?
                        await this._commentsRepository.GetAll()
                        .AsNoTracking()
                        .Where(c => c.Id == commentEvent.ParentId.Value)
                        .Select(c => this._objectMapper.Map<CommentDto>(c))
                        .FirstOrDefaultAsync()
                    : null;

                var url = "";
                var postUrl = "app/community/post/";
                var discussionUrl = "app/community/discussion/";

                if (comment != null)
                {
                    referenceId = comment.Id;
                    userId = comment.CreatorUserId.GetValueOrDefault();

                    var parentPost = await this._postsRepository.GetAll()
                        .Include(p => p.Parent)
                        .AsNoTracking()
                        .Where(p => p.Id == new Guid(comment.ReferenceId))
                        .FirstOrDefaultAsync();

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

                await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                {
                    UserId = userId,
                    ActorId = commentEvent.CreatorUserId.Value,
                    Action = await this.getNotificationAction(post, comment),
                    Target = await this.getNotificationTarget(post, comment),
                    ReferenceId = referenceId,
                    SourceId = commentEvent.Id,
                    Url = url
                }, BackgroundJobPriority.High);

                await uow.CompleteAsync();
            }
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
                    var reference = await this._postsRepository.GetAsync(new Guid(comment.ReferenceId));
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
