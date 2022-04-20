using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.ConferenceSessions.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.ConferenceSessions
{
    public class ConferenceSessionsAppService : AcademicallyAppServiceBase, IConferenceSessionsAppService
    {
        private readonly IRepository<ConferenceSession, Guid> _conferenceSessionsRepository;
        private readonly IRepository<ConferenceSessionCandidate, Guid> _conferenceSessionCandidatesRepository;

        public ConferenceSessionsAppService(
            IRepository<ConferenceSession, Guid> conferenceSessionsRepository,
            IRepository<ConferenceSessionCandidate, Guid> conferenceSessionCandidatesRepository
            )
        {
            _conferenceSessionsRepository = conferenceSessionsRepository;
            _conferenceSessionCandidatesRepository = conferenceSessionCandidatesRepository;
        }

        public async Task<ConferenceSessionDto> GetAsync(string referenceId)
        {
            var session = await _conferenceSessionsRepository.GetAll()
                .Where(e => e.ReferenceId == referenceId)
                .Include(e => e.ConferenceSessionCandidates)
                .FirstOrDefaultAsync();
            if (session == null)
            {
                session = new ConferenceSession()
                {
                    ReferenceId = referenceId,
                };
                await _conferenceSessionsRepository.InsertAsync(session);
            }
            return ObjectMapper.Map<ConferenceSessionDto>(session);
        }

        public async Task<ConferenceSessionCandidateDto> CreateCandidateAsync(ConferenceSessionCandidateDto input)
        {
            var sessionCandidate = ObjectMapper.Map<ConferenceSessionCandidate>(input);
            input.Id = await _conferenceSessionCandidatesRepository.InsertAndGetIdAsync(sessionCandidate);
            return input;
        }

        public async Task UpdateAsync(ConferenceSessionDto input)
        {
            var session = await _conferenceSessionsRepository.GetAsync(input.Id);
            session.Offer = input.Offer;
            session.Answer = input.Answer;
            await _conferenceSessionsRepository.UpdateAsync(session);
        }

        public async Task UpdateStatusAsync(Guid id, ConferenceSessionStatus status)
        {
            var session = await _conferenceSessionsRepository.GetAsync(id);
            session.Status = status;
            await _conferenceSessionsRepository.UpdateAsync(session);
        }

        public async Task DeleteCandidatesAsync(Guid id, SessionCandidateType type)
        {
            await _conferenceSessionCandidatesRepository.DeleteAsync(e => e.ConferenceSessionId == id && e.Type == type);
        }
    }
}

