using System;
using Abp.Application.Services;
using Academically.Services.CoachingPolls.Dto;

namespace Academically.Services.CoachingPolls
{
	public interface ICoachingPollsAppService : IAsyncCrudAppService<CoachingPollDto, Guid, PagedCoachingPollResultRequestDto, CreateCoachingPollDto>
	{
	}
}

