using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Services.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Services
{
    public class ServicePollsAppService : AsyncCrudAppService<ServicePoll, ServicePollDto, Guid, PagedServicePollResultRequestDto, CreateServicePollDto>, IServicePollsAppService
    {


        public ServicePollsAppService(IRepository<ServicePoll, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<ServicePoll> CreateFilteredQuery(PagedServicePollResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.ReferenceId == input.ReferenceIdFilter)
                .Where(e => e.ServiceType == input.ServiceTypeFilter);
        }

        protected override IQueryable<ServicePoll> ApplyPaging(IQueryable<ServicePoll> query, PagedServicePollResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.ServicePollQuestions);
        }

        public override Task<PagedResultDto<ServicePollDto>> GetAllAsync(PagedServicePollResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override async Task<ServicePollDto> GetAsync(EntityDto<Guid> input)
        {
            return await Repository.GetAll()
                .Where(e => e.Id == input.Id)
                .Include(e => e.ServicePollQuestions)
                    .ThenInclude(e => e.ServicePollQuestionOptions)
                .Select(e => ObjectMapper.Map<ServicePollDto>(e))
                .FirstOrDefaultAsync();
        }

        public override Task<ServicePollDto> CreateAsync(CreateServicePollDto input)
        {
            base.DeleteAsync(input);
            return base.CreateAsync(input);
        }
    }
}

