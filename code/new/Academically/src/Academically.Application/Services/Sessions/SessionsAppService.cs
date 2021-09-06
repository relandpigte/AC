using Abp.Configuration;
using Abp.Domain.Repositories;
using Academically.Configuration;
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
        private readonly IRepository<ConversationGroup, Guid> _conversationGroupsRepository;
        private readonly IRepository<CalendarEvent, Guid> _calendarEventsRepository;
        private readonly ISettingManager _settingManager;

        public SessionsAppService(
            IRepository<Session, Guid> sessionsRepository,
            IRepository<SessionCandidate, Guid> sessionCandidatesRepository,
            IRepository<ConversationGroup, Guid> conversationGroupsRepository,
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            ISettingManager settingManager
        )
        {
            _sessionsRepository = sessionsRepository;
            _sessionCandidatesRepository = sessionCandidatesRepository;
            _conversationGroupsRepository = conversationGroupsRepository;
            _calendarEventsRepository = calendarEventsRepository;
            _settingManager = settingManager;
        }

        public async Task<SessionDto> Get(Guid calendarEventId)
        {
            var session = await _sessionsRepository.GetAll()
                .Where(e => e.CalendarEventId == calendarEventId)
                .Include(e => e.CalendarEvent)
                .Include(e => e.SessionCandidates)
                .FirstOrDefaultAsync();
            Guid? projectId;
            if (session == null)
            {
                projectId = (await _calendarEventsRepository.GetAsync(calendarEventId)).ProjectId;
                session = new Session()
                {
                    CalendarEventId = calendarEventId,
                };
                await _sessionsRepository.InsertAsync(session);
            }
            else
            {
                projectId = session.CalendarEvent.ProjectId;
            }

            var conversationGroup = await _conversationGroupsRepository.FirstOrDefaultAsync(e => e.ProjectId == projectId);
            if (conversationGroup == null)
            {
                conversationGroup = new ConversationGroup()
                {
                    Name = session.CalendarEvent.Title,
                    ProjectId = session.CalendarEvent.ProjectId.Value,
                };
                await _conversationGroupsRepository.InsertAsync(conversationGroup);
            }

            var output = ObjectMapper.Map<SessionDto>(session);
            output.ConversationGroupId = conversationGroup.Id;

            return output;
        }

        public async Task<TurnServerConfigDto> GetConfiguration()
        {
            var config = new TurnServerConfigDto();
            config.Username = await _settingManager.GetSettingValueAsync(AppSettingNames.Providers_TurnServer_Username);
            config.Password = await _settingManager.GetSettingValueAsync(AppSettingNames.Providers_TurnServer_Password);
            return config;
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
