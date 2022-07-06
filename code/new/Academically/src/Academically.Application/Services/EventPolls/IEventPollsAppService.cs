using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.EventPolls.Dto;

namespace Academically.Services.EventPolls
{
	public interface IEventPollsAppService : IAsyncCrudAppService<EventPollDto, Guid, PagedEventPollResultRequestDto, CreateEventPollDto>
	{
		Task<IEnumerable<EventPollDto>> GetAllUnpagedAsync(Guid eventId);
	}
}

