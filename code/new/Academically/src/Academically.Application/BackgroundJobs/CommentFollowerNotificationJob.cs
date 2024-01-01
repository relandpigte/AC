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
    public class CommentFollowerNotificationJob : AsyncBackgroundJob<CommentFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly Abp.ObjectMapping.IObjectMapper _objectMapper;
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CommentFollowerNotificationJob(
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

        public override async Task ExecuteAsync(CommentFollowerNotificationJobArgs args)
        {
            var commentEvent = await this._commentsRepository.FirstOrDefaultAsync(args.CommentId);
            if (commentEvent == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == commentEvent.CreatorUserId);
                var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();

                var parentPost = await this._postsRepository.GetAll()
                    .Include(p => p.Parent)
                    .AsNoTracking()
                    .Where(p => p.Id == new Guid(commentEvent.ReferenceId))
                    .Select(p => this._objectMapper.Map<PostDto>(p))
                    .FirstOrDefaultAsync();

                var parentComment = commentEvent.ParentId.HasValue ?
                        await this._commentsRepository.GetAll()
                        .AsNoTracking()
                        .Where(c => c.Id == new Guid(commentEvent.ReferenceId))
                        .Select(c => this._objectMapper.Map<CommentDto>(c))
                        .FirstOrDefaultAsync()
                     : null;

                if (parentPost != null)
                {
                    foreach (var userId in userIds)
                    {
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = commentEvent.CreatorUserId.Value,
                            Action = await getNotificationAction(parentPost, parentComment),
                            Target = await getNotificationTarget(parentPost, parentComment),
                            ReferenceId = parentComment?.Id ?? parentPost.Id,
                            SourceId = commentEvent.Id,
                            Url = $"app/community/post/{parentPost.Id}"
                        }, BackgroundJobPriority.High);
                    }
                }

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
