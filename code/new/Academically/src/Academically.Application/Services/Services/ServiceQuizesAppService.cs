using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Services.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Services
{
    public class ServiceQuizesAppService : AsyncCrudAppService<ServiceQuiz, ServiceQuizDto, Guid, PagedServiceQuizResultRequestDto, CreateServiceQuizDto>, IServiceQuizesAppService
    {


        public ServiceQuizesAppService(IRepository<ServiceQuiz, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<ServiceQuiz> CreateFilteredQuery(PagedServiceQuizResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.ReferenceId == input.ReferenceIdFilter)
                .Where(e => e.ServiceType == input.ServiceTypeFilter);
        }

        protected override IQueryable<ServiceQuiz> ApplyPaging(IQueryable<ServiceQuiz> query, PagedServiceQuizResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.ServiceQuizQuestions);
        }

        public override Task<PagedResultDto<ServiceQuizDto>> GetAllAsync(PagedServiceQuizResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override async Task<ServiceQuizDto> GetAsync(EntityDto<Guid> input)
        {
            return await Repository.GetAll()
                .Where(e => e.Id == input.Id)
                .Include(e => e.ServiceQuizQuestions)
                    .ThenInclude(e => e.ServiceQuizQuestionOptions)
                .Select(e => ObjectMapper.Map<ServiceQuizDto>(e))
                .FirstOrDefaultAsync();
        }

        public override Task<ServiceQuizDto> CreateAsync(CreateServiceQuizDto input)
        {
            base.DeleteAsync(input);
            return base.CreateAsync(input);
        }
    }
}

