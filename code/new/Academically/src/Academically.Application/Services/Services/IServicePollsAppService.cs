using System;
using Abp.Application.Services;
using Academically.Services.Services.Dto;

namespace Academically.Services.Services
{
	public interface IServicePollsAppService : IAsyncCrudAppService<ServicePollDto, Guid, PagedServicePollResultRequestDto, CreateServicePollDto>
	{
	}
}

