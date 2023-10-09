using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Timing;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Services.Questions.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Questions
{
    public class QuestionsAppService : AcademicallyAppServiceBase, IQuestionsAppService
    {

        private readonly IRepository<Question, Guid> _questionsRepository;
        private readonly IRepository<QuestionReaction, Guid> _questionsReactionsRepository;
        private readonly IRepository<User, long> _usersRepository;

        public QuestionsAppService(
            IRepository<Question, Guid> questionsRepository,
            IRepository<QuestionReaction, Guid> questionsReactionsRepository,
            IRepository<User, long> usersRepository
            )
        {
            _questionsRepository = questionsRepository;
            _questionsReactionsRepository = questionsReactionsRepository;
            _usersRepository = usersRepository;
        }

        public async Task<IEnumerable<QuestionDto>> GetAllAsync(GetQuestionsRequestDto input)
        {
            var questionsWithReplyCount = await _questionsRepository.GetAll()
                .Where(e => e.ParentId == null && e.ReferenceId == input.ReferenceId)
                .WhereIf(input.CreatorId.HasValue, q => q.CreatorUserId == input.CreatorId.Value)
                .WhereIf(
                    input.HostId.HasValue && input.Answered.HasValue && !input.Answered.Value,
                    q => !q.Children.Any(q => q.CreatorUserId == input.HostId.Value)
                )
                .WhereIf(
                    input.HostId.HasValue && input.Answered.HasValue && input.Answered.Value,
                    q => q.Children.Any(q => q.CreatorUserId == input.HostId.Value)
                )
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.QuestionReactions)
                .Include(e => e.Children)
                    .ThenInclude(q => q.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .OrderByDescending(e => e.CreationTime)
                .Select(e => new
                {
                    Question = e,
                    ChildCount = e.Children.Count(),
                })
                .ToListAsync();
            

            return questionsWithReplyCount.Select(e =>
            {
                var question = ObjectMapper.Map<QuestionDto>(e.Question);
                question.ReplyCount = e.ChildCount;
                question.Children = question.Children.OrderByDescending(c => c.CreationTime).ToList();
                return question;
            });
        }

        public async Task<QuestionDto> GetAsync(Guid questionId)
        {
            var question = await _questionsRepository
                .GetAll()
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.QuestionReactions)
                .Include(e => e.Children)
                    .ThenInclude(q => q.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .SingleOrDefaultAsync(q => q.Id == questionId);
            
            question.Children = question.Children.OrderByDescending(c => c.CreationTime).ToList();
            return ObjectMapper.Map<QuestionDto>(question);
        }


        public async Task<PagedResultDto<QuestionDto>> GetAllRepliesAsync(PagedQuestionResultRequestDto input)
        {
            var query = _questionsRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter);
            var totalCount = await query.CountAsync();
            var questions = await query.OrderByDescending(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.QuestionReactions)
                .Select(e => ObjectMapper.Map<QuestionDto>(e))
                .ToListAsync();
            return new PagedResultDto<QuestionDto>(totalCount, questions);

        }

        public async Task<QuestionDto> CreateAsync(QuestionDto input)
        {
            var question = ObjectMapper.Map<Question>(input);
            input.CreationTime = Clock.Now;
            input.Id = await _questionsRepository.InsertAndGetIdAsync(question);
            input.CreatorUser = await _usersRepository.GetAllIncluding()
                .Where(e => e.Id == AbpSession.UserId.Value)
                .Include(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<UserDto>(e))
                .FirstOrDefaultAsync();
            return input;
        }

        public async Task<QuestionReactionDto> CreateReactionAsync(QuestionReactionDto input)
        {
            input.CreatorUserId = AbpSession.UserId.Value;
            var reaction = ObjectMapper.Map<QuestionReaction>(input);
            input.Id = await _questionsReactionsRepository.InsertAndGetIdAsync(reaction);
            return input;
        }

        public async Task DeleteReactionAsync(Guid id)
        {
            await _questionsReactionsRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<QuestionReactionDto>> GetReactionByReferenceAsync(Guid referenceId)
        {
            return await _questionsReactionsRepository.GetAll()
                .Where(r => r.ReferenceId == referenceId)
                .Select(r => ObjectMapper.Map<QuestionReactionDto>(r))
                .ToListAsync();
        }
    }
}
