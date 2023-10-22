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
		Task<IEnumerable<EventPollDto>> GetAllUnpagedForStudentsAsync(Guid eventId, EventPollStudentStatus? status);
        Task<EventPollDto> LaunchPoll(Guid id);
        Task<EventPollDto> ClosePoll(Guid id);
        Task<EventPollDto> SharePoll(Guid id);
        Task<EventPollDto> UpsertPollAnswer(UpsertEventPollAnswerDto input);
        Task<EventPollDto> SubmitPollAnswers(Guid id, Guid eventPollId);
    }
}

