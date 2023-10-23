using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Hubs;
using Academically.Services.EventPolls.Dto;
using Academically.Services.Services.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Academically.Services.EventPolls
{
    public class EventPollsAppService : AsyncCrudAppService<EventPoll, EventPollDto, Guid, PagedEventPollResultRequestDto, CreateEventPollDto>, IEventPollsAppService
    {
        private readonly IRepository<EventPollAnswer, Guid> _eventPollAnswersRepository;
        private readonly IHubManager _hubManager;

        public EventPollsAppService(
            IRepository<EventPollAnswer, Guid> eventPollAnswersRepository,
            IRepository<EventPoll, Guid> repository,
            IHubManager hubManager
        ) : base(repository)
        {
            this._eventPollAnswersRepository = eventPollAnswersRepository;
            this._hubManager = hubManager;
        }

        protected override IQueryable<EventPoll> CreateFilteredQuery(PagedEventPollResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .WhereIf(input.EventIdFilter.HasValue, e => e.EventId == input.EventIdFilter.Value)
                .WhereIf(input.Status.HasValue, e => e.Status == input.Status.Value);
        }

        protected override IQueryable<EventPoll> ApplyPaging(IQueryable<EventPoll> query, PagedEventPollResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.EventPollQuestions);
        }

        public override Task<PagedResultDto<EventPollDto>> GetAllAsync(PagedEventPollResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override async Task<EventPollDto> GetAsync(EntityDto<Guid> input)
        {
            var poll = await Repository.GetAll()
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollQuestionOptions)
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollAnswers)
                        .ThenInclude(a => a.CreatorUser)
                            .ThenInclude(u => u.ProfilePictureDocument)
                .Where(e => e.Id == input.Id)
                .Select(e => ObjectMapper.Map<EventPollDto>(e))
                .FirstOrDefaultAsync();

            if (poll.CreatorUserId != this.AbpSession.UserId)
            {
                foreach (var question in poll.EventPollQuestions)
                {
                    question.EventPollAnswers = question.EventPollAnswers.Where(a => a.CreatorUserId == this.AbpSession.UserId).ToList();
                }
            }

            return poll;
        }

        public override Task<EventPollDto> CreateAsync(CreateEventPollDto input)
        {
            base.DeleteAsync(input);
            return base.CreateAsync(input);
        }

        public override Task<EventPollDto> UpdateAsync(CreateEventPollDto input)
        {
            base.DeleteAsync(input);
            UnitOfWorkManager.Current.SaveChanges();
            return base.CreateAsync(input);
        }

        public async Task<IEnumerable<EventPollDto>> GetAllUnpagedAsync(Guid eventId, EventPollStatus? status)
        {
            var polls = await Repository.GetAll()
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollQuestionOptions)
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollAnswers)
                        .ThenInclude(a => a.CreatorUser)
                            .ThenInclude(u => u.ProfilePictureDocument)
                .WhereIf(status.HasValue, e => e.Status == status.Value)
                .Where(e => e.EventId == eventId)
                .Select(e => ObjectMapper.Map<EventPollDto>(e))
                .ToListAsync();

            return polls;
        }

        public async Task<IEnumerable<EventPollDto>> GetAllUnpagedForStudentsAsync(Guid eventId, EventPollStudentStatus? status)
        {
            var polls = await Repository.GetAll()
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollQuestionOptions)
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollAnswers)
                        .ThenInclude(a => a.CreatorUser)
                            .ThenInclude(u => u.ProfilePictureDocument)
                .Where(e => e.Status == EventPollStatus.Open || e.Status == EventPollStatus.Closed)
                .Where(e => e.EventId == eventId)
                .Select(e => ObjectMapper.Map<EventPollDto>(e))
                .ToListAsync();

            if (status.HasValue)
            {
                if (status.Value == EventPollStudentStatus.Results) polls = polls.Where(e => e.SharedTime != null && (e.Status == EventPollStatus.Closed || e.EventPollQuestions.All(q => q.HasBeenAnswered))).ToList();
                else polls = polls.Where(e => e.Status == EventPollStatus.Open && e.EventPollQuestions.Any(q => !q.HasBeenAnswered)).ToList();

                if (status.Value == EventPollStudentStatus.Todo)
                {
                    foreach (var poll in polls)
                    {
                        foreach (var question in poll.EventPollQuestions)
                        {
                            question.EventPollAnswers = question.EventPollAnswers.Where(a => a.CreatorUserId == this.AbpSession.UserId).ToList();
                        }
                    }
                }
            }
            
            return polls;
        }

        public async Task<EventPollDto> LaunchPoll(Guid id)
        {
            var poll = await this.Repository.GetAll()
               .Where(o => o.Id == id)
               .FirstOrDefaultAsync();

            if (poll != null)
            {
                poll.Status = EventPollStatus.Open;
                poll.LaunchedTime = DateTime.Now;
                await this._hubManager.NotifyUsersForEventPollLaunched(ObjectMapper.Map<EventPollDto>(poll));
                return ObjectMapper.Map<EventPollDto>(poll);
            }
            return null;
        }

        public async Task<EventPollDto> ClosePoll(Guid id)
        {
            var poll = await this.Repository.GetAll()
               .Where(o => o.Id == id)
               .FirstOrDefaultAsync();

            if (poll != null)
            {
                poll.Status = EventPollStatus.Closed;
                poll.EndedTime = DateTime.Now;
                await this._hubManager.NotifyUsersForEventPollClosed(ObjectMapper.Map<EventPollDto>(poll));
                return ObjectMapper.Map<EventPollDto>(poll);
            }
            return null;
        }

        public async Task<EventPollDto> SharePoll(Guid id)
        {
            var poll = await this.Repository.GetAll()
               .Where(o => o.Id == id)
               .FirstOrDefaultAsync();

            if (poll != null)
            {
                poll.SharedTime = DateTime.Now;
                await this._hubManager.NotifyUsersForEventPollShared(ObjectMapper.Map<EventPollDto>(poll));
                return ObjectMapper.Map<EventPollDto>(poll);
            }
            return null;
        }

        public async Task<EventPollDto> UpsertPollAnswer(UpsertEventPollAnswerDto input)
        {
            var existing = await this._eventPollAnswersRepository.GetAll()
                .Where(a => a.ReferenceId == input.ReferenceId)
                .Where(a => a.EventPollId == input.EventPollId)
                .Where(a => a.EventPollQuestionId == input.EventPollQuestionId)
                .SingleOrDefaultAsync();
            if (existing != null)
            {
                existing.ReferenceId = input.ReferenceId;
                existing.EventPollId = input.EventPollId;
                existing.EventPollQuestionId = input.EventPollQuestionId;
                existing.EventPollQuestionOptionId = input.EventPollQuestionOptionId;
            }
            else
            {
                input.CreatorUserId = this.AbpSession.UserId.Value;
                await this._eventPollAnswersRepository.InsertAsync(ObjectMapper.Map<EventPollAnswer>(input));
            }
            return await this.PushUpdatedPoll(input.EventPollId);
        }

        public async Task<EventPollDto> SubmitPollAnswers(Guid id, Guid eventPollId)
        {
            var now = Clock.Now;
            var answers = await this._eventPollAnswersRepository.GetAll()
                .Where(a => a.ReferenceId == id)
                .Where(a => a.EventPollId == eventPollId)
                .Where(a => a.CreatorUserId == this.AbpSession.UserId)
                .Where(a => a.SubmittedTime == null)
                .ToListAsync();

            foreach (var answer in answers) answer.SubmittedTime = now;

            return await this.PushUpdatedPoll(eventPollId);
        }

        private async Task<EventPollDto> PushUpdatedPoll(Guid id)
        {
            var poll = await this.Repository.GetAll()
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollQuestionOptions)
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollAnswers)
                .Where(e => e.Id == id)
                .FirstOrDefaultAsync();

            if (poll != null)
            {
                foreach (var question in poll.EventPollQuestions)
                {
                    question.EventPollAnswers = question.EventPollAnswers.Where(a => a.CreatorUserId == this.AbpSession.UserId).ToList();
                }
                await this._hubManager.NotifyUsersForEventPollUpdated(ObjectMapper.Map<EventPollDto>(poll));
                return ObjectMapper.Map<EventPollDto>(poll);
            }
            return null;
        }
    }
}

