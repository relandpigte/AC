using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.ConferenceSessions.Dto;

namespace Academically.Services.ConferenceSessions
{
    public interface IConferenceSessionsAppService : IApplicationService
	{
		Task<ConferenceSessionDto> GetAsync(string referenceId);
		Task<ConferenceSessionCandidateDto> CreateCandidateAsync(ConferenceSessionCandidateDto input);
		Task UpdateAsync(ConferenceSessionDto input);
		Task UpdateStatusAsync(Guid id, ConferenceSessionStatus status);
		Task DeleteCandidatesAsync(Guid id, SessionCandidateType type);
	}
}

