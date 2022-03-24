using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Topics.Dto;

namespace Academically.Services.Topics
{
    public interface ITopicsAppService : IAsyncCrudAppService<TopicDto, Guid, PagedTopicResultRequestDto, CreateTopicDto, UpdateTopicDto>
	{
		Task<IEnumerable<TopicUsageDto>> GetUsage();
    }
}

