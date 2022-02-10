using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Timing;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Services.Comments.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Comments
{
    public class CommentsAppService : AcademicallyAppServiceBase, ICommentsAppService
    {
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<CommentReaction, Guid> _commentsReactionsRepository;
        private readonly IRepository<User, long> _usersRepository;

        public CommentsAppService(
            IRepository<Comment, Guid> commentsRepository,
            IRepository<CommentReaction, Guid> commentsReactionsRepository,
            IRepository<User, long> usersRepository
            )
        {
            _commentsRepository = commentsRepository;
            _commentsReactionsRepository = commentsReactionsRepository;
            _usersRepository = usersRepository;
        }

        public async Task<IEnumerable<CommentDto>> GetAllAsync(string referenceId)
        {
            var commentsWithReplyCount = await _commentsRepository.GetAll()
                .Where(e => e.ParentId == null && e.ReferenceId == referenceId)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .OrderByDescending(e => e.CreationTime)
                .Select(e => new
                {
                    Comment = e,
                    ChildCount = e.Children.Count(),
                })
                .ToListAsync();

            return commentsWithReplyCount.Select(e =>
            {
                var comment = ObjectMapper.Map<CommentDto>(e.Comment);
                comment.ReplyCount = e.ChildCount;
                return comment;
            });
        }

        public async Task<PagedResultDto<CommentDto>> GetAllRepliesAsync(PagedCommentResultRequestDto input)
        {
            var query = _commentsRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter);
            var totalCount = await query.CountAsync();
            var comments = await query.OrderByDescending(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .Select(e => ObjectMapper.Map<CommentDto>(e))
                .ToListAsync();
            return new PagedResultDto<CommentDto>(totalCount, comments);

        }

        public async Task<CommentDto> CreateAsync(CommentDto input)
        {
            var comment = ObjectMapper.Map<Comment>(input);
            input.CreationTime = Clock.Now;
            input.Id = await _commentsRepository.InsertAndGetIdAsync(comment);
            input.CreatorUser = await _usersRepository.GetAllIncluding()
                .Where(e => e.Id == AbpSession.UserId.Value)
                .Include(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<UserDto>(e))
                .FirstOrDefaultAsync();
            return input;
        }

        public async Task<CommentReactionDto> CreateReactionAsync(CommentReactionDto input)
        {
            input.CreatorUserId = AbpSession.UserId.Value;
            var reaction = ObjectMapper.Map<CommentReaction>(input);
            input.Id = await _commentsReactionsRepository.InsertAndGetIdAsync(reaction);
            return input;
        }

        public async Task DeleteReactionAsync(Guid id)
        {
            await _commentsReactionsRepository.DeleteAsync(id);
        }
    }
}
