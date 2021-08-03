using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Sessions.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Sessions
{
    public class SessionsAppService : AcademicallyAppServiceBase, ISessionsAppService
    {
        private readonly IRepository<Session, Guid> _sessionsRepository;
        private readonly IRepository<SessionCandidate, Guid> _sessionCandidatesRepository;

        public SessionsAppService(
            IRepository<Session, Guid> sessionsRepository,
            IRepository<SessionCandidate, Guid> sessionCandidatesRepository
        )
        {
            _sessionsRepository = sessionsRepository;
            _sessionCandidatesRepository = sessionCandidatesRepository;
        }

        public async Task<SessionDto> Get(Guid calendarEventId)
        {
            var session = await _sessionsRepository.GetAll()
                .Where(e => e.CalendarEventId == calendarEventId)
                .Include(e => e.SessionCandidates)
                .FirstOrDefaultAsync();
            if (session == null)
            {
                session = new Session()
                {
                    CalendarEventId = calendarEventId,
                };
                await _sessionsRepository.InsertAsync(session);
            }

            return ObjectMapper.Map<SessionDto>(session);
        }

        public async Task<SessionCandidateDto> CreateCandidate(SessionCandidateDto input)
        {
            var sessionCandidate = ObjectMapper.Map<SessionCandidate>(input);
            input.Id = await _sessionCandidatesRepository.InsertAndGetIdAsync(sessionCandidate);
            return input;
        }

        public async Task Update(SessionDto input)
        {
            var session = await _sessionsRepository.GetAsync(input.Id);
            session.Offer = input.Offer;
            session.Answer = input.Answer;
            await _sessionsRepository.UpdateAsync(session);
        }

        public async Task DeleteCandidates(Guid id, SessionCandidateType type)
        {
            await _sessionCandidatesRepository.DeleteAsync(e => e.SessionId == id && e.Type == type);
        }
    }
}
