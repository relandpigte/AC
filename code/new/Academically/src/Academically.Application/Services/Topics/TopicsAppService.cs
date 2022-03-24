using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.Topics.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Topics
{
    public class TopicsAppService : AsyncCrudAppService<Topic, TopicDto, Guid, PagedTopicResultRequestDto, CreateTopicDto, UpdateTopicDto>, ITopicsAppService
    {
        public TopicsAppService(IRepository<Topic, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<Topic> CreateFilteredQuery(PagedTopicResultRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            return base.CreateFilteredQuery(input)
                .Where(e => e.Name.ToLower().Contains(input.SearchFilter));
        }

        [AbpAuthorize(PermissionNames.Pages_Topics_Usage)]
        public async Task<IEnumerable<TopicUsageDto>> GetUsage()
        {
            return (await Repository.GetAll()
                .Select(e => new TopicUsageDto()
                {
                    Name = e.Name,
                    TotalUsage = e.ForumTopics.Count,
                })
                .ToListAsync())
                .OrderByDescending(e => e.TotalUsage)
                    .ThenBy(e => e.Name);
        }
    }
}

