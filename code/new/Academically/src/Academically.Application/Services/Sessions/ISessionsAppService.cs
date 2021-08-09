using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.Sessions.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Sessions
{
    public interface ISessionsAppService : IApplicationService
    {
        Task<SessionDto> Get(Guid calendarEventId);
        Task<TurnServerConfigDto> GetConfiguration();
        Task<SessionCandidateDto> CreateCandidate(SessionCandidateDto input);
        Task Update(SessionDto input);
        Task DeleteCandidates(Guid id, SessionCandidateType type);
    }
}
