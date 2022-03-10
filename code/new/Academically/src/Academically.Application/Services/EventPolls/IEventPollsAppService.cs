using System;
using Abp.Application.Services;
using Academically.Services.EventPolls.Dto;

namespace Academically.Services.EventPolls
{
	public interface IEventPollsAppService : IAsyncCrudAppService<EventPollDto, Guid, PagedEventPollResultRequestDto, CreateEventPollDto>
	{
	}
}

