using System;
using Abp.Application.Services;
using Academically.Services.CoachingResources.Dto;

namespace Academically.Services.CoachingResources
{
	public interface ICoachingResourcesAppService : IAsyncCrudAppService<CoachingResourceDto, Guid, PagedCoachingResourceResultRequestDto, CreateCoachingResourceDto>
	{
	}
}

