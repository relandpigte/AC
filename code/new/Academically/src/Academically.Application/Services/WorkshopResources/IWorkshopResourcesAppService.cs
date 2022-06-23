using System;
using Abp.Application.Services;
using Academically.Services.WorkshopResources.Dto;

namespace Academically.Services.WorkshopResources
{
	public interface IWorkshopResourcesAppService : IAsyncCrudAppService<WorkshopResourceDto, Guid, PagedWorkshopResourceResultRequestDto, CreateWorkshopResourceDto>
	{
	}
}

