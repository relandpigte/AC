using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.CoachingPolls.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CoachingPolls
{
    public class CoachingPollsAppService : AsyncCrudAppService<CoachingPoll, CoachingPollDto, Guid, PagedCoachingPollResultRequestDto, CreateCoachingPollDto>, ICoachingPollsAppService
    {


        public CoachingPollsAppService(IRepository<CoachingPoll, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<CoachingPoll> CreateFilteredQuery(PagedCoachingPollResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.CoachingId == input.CoachingIdFilter);
        }

        protected override IQueryable<CoachingPoll> ApplyPaging(IQueryable<CoachingPoll> query, PagedCoachingPollResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.CoachingPollQuestions);
        }

        public override Task<PagedResultDto<CoachingPollDto>> GetAllAsync(PagedCoachingPollResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override async Task<CoachingPollDto> GetAsync(EntityDto<Guid> input)
        {
            return await Repository.GetAll()
                .Where(e => e.Id == input.Id)
                .Include(e => e.CoachingPollQuestions)
                    .ThenInclude(e => e.CoachingPollQuestionOptions)
                .Select(e => ObjectMapper.Map<CoachingPollDto>(e))
                .FirstOrDefaultAsync();
        }

        public override Task<CoachingPollDto> CreateAsync(CreateCoachingPollDto input)
        {
            base.DeleteAsync(input);
            return base.CreateAsync(input);
        }
    }
}

