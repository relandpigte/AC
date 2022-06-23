using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.WorkshopPolls.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.WorkshopPolls
{
    public class WorkshopPollsAppService : AsyncCrudAppService<WorkshopPoll, WorkshopPollDto, Guid, PagedWorkshopPollResultRequestDto, CreateWorkshopPollDto>, IWorkshopPollsAppService
    {


        public WorkshopPollsAppService(IRepository<WorkshopPoll, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<WorkshopPoll> CreateFilteredQuery(PagedWorkshopPollResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.WorkshopId == input.WorkshopIdFilter);
        }

        protected override IQueryable<WorkshopPoll> ApplyPaging(IQueryable<WorkshopPoll> query, PagedWorkshopPollResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.WorkshopPollQuestions);
        }

        public override Task<PagedResultDto<WorkshopPollDto>> GetAllAsync(PagedWorkshopPollResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override async Task<WorkshopPollDto> GetAsync(EntityDto<Guid> input)
        {
            return await Repository.GetAll()
                .Where(e => e.Id == input.Id)
                .Include(e => e.WorkshopPollQuestions)
                    .ThenInclude(e => e.WorkshopPollQuestionOptions)
                .Select(e => ObjectMapper.Map<WorkshopPollDto>(e))
                .FirstOrDefaultAsync();
        }

        public override Task<WorkshopPollDto> CreateAsync(CreateWorkshopPollDto input)
        {
            base.DeleteAsync(input);
            return base.CreateAsync(input);
        }
    }
}

