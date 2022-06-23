using System;
using Abp.Application.Services;
using Academically.Services.WorkshopPolls.Dto;

namespace Academically.Services.WorkshopPolls
{
	public interface IWorkshopPollsAppService : IAsyncCrudAppService<WorkshopPollDto, Guid, PagedWorkshopPollResultRequestDto, CreateWorkshopPollDto>
	{
	}
}

