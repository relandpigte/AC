using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.EventPolls.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.EventPolls
{
    public class EventPollsAppService : AsyncCrudAppService<EventPoll, EventPollDto, Guid, PagedEventPollResultRequestDto, CreateEventPollDto>, IEventPollsAppService
    {


        public EventPollsAppService(IRepository<EventPoll, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<EventPoll> CreateFilteredQuery(PagedEventPollResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.EventId == input.EventIdFilter);
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

        public async Task<IEnumerable<EventPollDto>> GetAllUnpagedAsync(Guid eventId)
        {
            return await Repository.GetAll()
                .Where(e => e.EventId == eventId)
                    .Include(e => e.EventPollQuestions)
                        .ThenInclude(e => e.EventPollQuestionOptions)
                .Select(e => ObjectMapper.Map<EventPollDto>(e))
                .ToListAsync();
        }
    }
}

