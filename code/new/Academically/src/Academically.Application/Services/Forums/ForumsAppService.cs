using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Services.Forums.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Forums
{
    public class ForumsAppService : AsyncCrudAppService<Forum, ForumDto, Guid, PagedForumResultRequestDto, CreateForumDto, UpdateForumDto>, IForumsAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<ForumReply, Guid> _forumRepliesRepository;
        private readonly IRepository<Reaction, Guid> _reactionsRepository;

        public ForumsAppService(
            UserManager userManager,
            IRepository<ForumReply, Guid> forumRepliesRepository,
            IRepository<Reaction, Guid> reactionsRepository,
            IRepository<Forum, Guid> repository
            ) : base(repository)
        {
            _userManager = userManager;
            _forumRepliesRepository = forumRepliesRepository;
            _reactionsRepository = reactionsRepository;
        }

        protected override IQueryable<Forum> ApplySorting(IQueryable<Forum> query, PagedForumResultRequestDto input)
        {
            return base.ApplySorting(query, input)
                .OrderByDescending(e => e.CreationTime);
        }

        protected override IQueryable<Forum> ApplyPaging(IQueryable<Forum> query, PagedForumResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.ForumReplies)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.ForumTopics)
                    .ThenInclude(e => e.Topic);
        }

        protected override Forum MapToEntity(CreateForumDto createInput)
        {
            var forum = base.MapToEntity(createInput);

            if (createInput.Topics != null)
            {
                foreach (var topic in createInput.Topics)
                {
                    if (topic.TopicId.HasValue)
                    {
                        forum.ForumTopics.Add(new ForumTopic()
                        {
                            TopicId = topic.TopicId.Value,
                        });
                    }
                    else
                    {
                        forum.ForumTopics.Add(new ForumTopic()
                        {
                            Topic = new Topic()
                            {
                                Name = topic.TopicName,
                            }
                        });
                    }
                }
            }

            return forum;
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            await _reactionsRepository.DeleteAsync(e => e.ReferenceId == input.Id.ToString());
            await base.DeleteAsync(input);
        }

        public async Task<ForumReplyDto> CreateReplyAsync(CreateForumReplyDto input)
        {
            var reply = ObjectMapper.Map<ForumReply>(input);
            await _forumRepliesRepository.InsertAsync(reply);
            var output = ObjectMapper.Map<ForumReplyDto>(reply);
            var replyUser = await _userManager.GetUserByIdAsync(AbpSession.UserId.Value);
            output.CreatorUser = ObjectMapper.Map<UserDto>(replyUser);
            return output;
        }
    }
}