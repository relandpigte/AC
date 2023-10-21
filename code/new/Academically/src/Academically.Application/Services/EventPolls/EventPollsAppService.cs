using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Hubs;
using Academically.Services.EventPolls.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.EventPolls
{
    public class EventPollsAppService : AsyncCrudAppService<EventPoll, EventPollDto, Guid, PagedEventPollResultRequestDto, CreateEventPollDto>, IEventPollsAppService
    {
        private readonly IHubManager _hubManager;

        public EventPollsAppService(
            IRepository<EventPoll, Guid> repository,
            IHubManager hubManager
        ) : base(repository)
        {
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
            return await Repository.GetAll()
                .Where(e => e.Id == input.Id)
                .Include(e => e.EventPollQuestions)
                    .ThenInclude(e => e.EventPollQuestionOptions)
                .Select(e => ObjectMapper.Map<EventPollDto>(e))
                .FirstOrDefaultAsync();
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
            return await Repository.GetAll()
                .WhereIf(status.HasValue, e => e.Status == status.Value)
                .Where(e => e.EventId == eventId)
                    .Include(e => e.EventPollQuestions)
                        .ThenInclude(e => e.EventPollQuestionOptions)
                .Select(e => ObjectMapper.Map<EventPollDto>(e))
                .ToListAsync();
        }

        public async Task<EventPollDto> LaunchPoll(Guid Id)
        {
            var poll = await this.Repository.GetAll()
               .Where(o => o.Id == Id)
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

        public async Task<EventPollDto> ClosePoll(Guid Id)
        {
            var poll = await this.Repository.GetAll()
               .Where(o => o.Id == Id)
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
    }
}

