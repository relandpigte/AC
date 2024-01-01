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
    public class ReactionUserNotificationJob : AsyncBackgroundJob<ReactionUserNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly Abp.ObjectMapping.IObjectMapper _objectMapper;
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ReactionUserNotificationJob(
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

        public override async Task ExecuteAsync(ReactionUserNotificationJobArgs args)
        {
            var reaction = args.Reaction;
            if (reaction == null) return;

            Guid referenceId = new Guid();
            Guid sourceId = new Guid();
            long userId = 0;
            PostDto post = null;
            CommentDto comment = null;
            var url = "";

            using (var uow = _unitOfWorkManager.Begin())
            {
                post = await this._postsRepository.GetAll()
                    .Include(p => p.Parent)
                    .AsNoTracking()
                    .Where(p => p.Id == new Guid(reaction.ReferenceId))
                    .Select(p => this._objectMapper.Map<PostDto>(p))
                    .FirstOrDefaultAsync();

                comment = await this._commentsRepository.GetAll()
                    .AsNoTracking()
                    .Where(c => c.Id == new Guid(reaction.ReferenceId))
                    .Select(c => this._objectMapper.Map<CommentDto>(c))
                    .FirstOrDefaultAsync();

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
                    var parentPost = await this._postsRepository.GetAll()
                        .Include(p => p.Parent)
                        .AsNoTracking()
                        .Where(p => p.Id == new Guid(comment.ReferenceId))
                        .FirstOrDefaultAsync();

                    referenceId = parentPost.Id;
                    sourceId = comment.Id;
                    userId = comment.CreatorUserId.GetValueOrDefault();
                    if (parentPost.Parent != null && parentPost.Parent.Type == PostType.Discussion)
                        url = $"{discussionUrl}{parentPost.ParentId}";
                    else
                        url = $"{postUrl}{comment.ReferenceId}";
                }

                await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                {
                    UserId = userId,
                    ActorId = reaction.CreatorUserId,
                    Action = await this.getNotificationAction(reaction.Type),
                    Target = await this.getNotificationTarget(post, comment),
                    ReferenceId = referenceId,
                    SourceId = sourceId,
                    Url = url
                }, BackgroundJobPriority.High);

                await uow.CompleteAsync();
            }
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
                    var reference = await this._postsRepository.GetAsync(new Guid(comment.ReferenceId));
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
