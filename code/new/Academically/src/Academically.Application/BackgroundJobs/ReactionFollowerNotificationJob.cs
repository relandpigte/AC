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
using System.Threading.Tasks;

namespace Academically.BackgroundJobs
{
    public class ReactionFollowerNotificationJob : AsyncBackgroundJob<ReactionFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly Abp.ObjectMapping.IObjectMapper _objectMapper;
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ReactionFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            Abp.ObjectMapping.IObjectMapper objectMapper,
            IRepository<Post, Guid> postsRepository,
            IRepository<Comment, Guid> commentsRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _objectMapper = objectMapper;
            _postsRepository = postsRepository;
            _commentsRepository = commentsRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(ReactionFollowerNotificationJobArgs args)
        {
            var reaction = args.Reaction;
            if (reaction == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == reaction.CreatorUserId);
                var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();
                
                const string postUrl = "app/community/post/";
                const string discussionUrl = "app/community/discussion/";

                var post = await this._postsRepository.GetAll()
                    .Include(p => p.Parent)
                    .AsNoTracking()
                    .Where(p => p.Id == new Guid(reaction.ReferenceId))
                    .Select(p => this._objectMapper.Map<PostDto>(p))
                    .FirstOrDefaultAsync();

                if (post != null)
                {
                    foreach (var userId in userIds)
                    {
                        if (!userId.HasValue) return;
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = reaction.CreatorUserId,
                            Action = await getNotificationAction(reaction.Type),
                            Target = await getNotificationTarget(post, null),
                            ReferenceId = post.Id,
                            SourceId = post.Id,
                            Url = post.Parent is { Type: PostType.Discussion } ? $"{discussionUrl}{post.ParentId}" : $"{postUrl}{post.Id}"
                        }, BackgroundJobPriority.High);
                    }
                }

                var comment = await this._commentsRepository.GetAll()
                     .AsNoTracking()
                     .Where(c => c.Id == new Guid(reaction.ReferenceId))
                     .Select(c => this._objectMapper.Map<CommentDto>(c))
                     .FirstOrDefaultAsync();

                if (comment != null)
                {
                    var parentPost = await this._postsRepository.GetAll()
                        .Include(p => p.Parent)
                        .AsNoTracking()
                        .Where(p => p.Id == new Guid(comment.ReferenceId))
                        .FirstOrDefaultAsync();

                    foreach (var userId in userIds)
                    {
                        if (!userId.HasValue) return;
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = reaction.CreatorUserId,
                            Action = await getNotificationAction(reaction.Type),
                            Target = await getNotificationTarget(null, comment),
                            ReferenceId = parentPost.Id,
                            SourceId = comment.Id,
                            Url = parentPost.Parent is { Type: PostType.Discussion } ? $"{discussionUrl}{parentPost.ParentId}" : $"{postUrl}{comment.ReferenceId}"
                        }, BackgroundJobPriority.High);
                    }
                }

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
