using System;
using Abp.Application.Services;
using Academically.Services.EventResources.Dto;

namespace Academically.Services.EventResources
{
	public interface IEventResourcesAppService : IAsyncCrudAppService<EventResourceDto, Guid, PagedEventResourceResultRequestDto, CreateEventResourceDto>
	{
	}
}

