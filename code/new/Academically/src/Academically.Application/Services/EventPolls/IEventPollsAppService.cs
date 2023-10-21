using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.EventPolls.Dto;

namespace Academically.Services.EventPolls
{
	public interface IEventPollsAppService : IAsyncCrudAppService<EventPollDto, Guid, PagedEventPollResultRequestDto, CreateEventPollDto>
	{
		Task<IEnumerable<EventPollDto>> GetAllUnpagedAsync(Guid eventId, EventPollStatus? status);
        Task<EventPollDto> LaunchPoll(Guid Id);
        Task<EventPollDto> ClosePoll(Guid Id);
        Task<EventPollDto> SharePoll(Guid Id);
    }
}

