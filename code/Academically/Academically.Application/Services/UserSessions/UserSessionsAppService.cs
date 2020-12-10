using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.UserSessions.Dto;
using AgoraIO.Media;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserSessions
{
    public class UserSessionsAppService : AcademicallyAppServiceBase, IUserSessionsAppService
    {
        private readonly IRepository<Session, Guid> _sessionsRepository;
        private readonly ISettingManager _settingManager;

        public UserSessionsAppService(
            IRepository<Session, Guid> sessionRepository,
            ISettingManager settingManager
            )
        {
            _sessionsRepository = sessionRepository;
            _settingManager = settingManager;
        }

        public async Task<IEnumerable<SessionDto>> GetUpcomingAsync(bool isStudent = false)
        {
            var sessionsQuery = _sessionsRepository.GetAll();

            if (isStudent)
            {
                sessionsQuery = sessionsQuery
                    .Where(e => e.TutorOffer.Tutorial.Student.UserId == AbpSession.UserId.Value)
                    .Include(e => e.TutorOffer.Tutor.User);
            }
            else
            {
                sessionsQuery = sessionsQuery
                    .Where(e => e.TutorOffer.Tutor.UserId == AbpSession.UserId.Value)
                    .Include(e => e.TutorOffer.Tutorial.Student.User);
            }

            var sessions = await sessionsQuery.OrderByDescending(e => e.SessionDate)
                .Take(5)
                .Select(e => ObjectMapper.Map<SessionDto>(e))
                .ToListAsync();

            return sessions;
        }

        public async Task CreateAsync(SessionDto input)
        {
            var sessionDetail = new Session();
            ObjectMapper.Map(input, sessionDetail);

            await _sessionsRepository.InsertAsync(sessionDetail);
        }

        public async Task<JoinSessionDto> JoinAsync(Guid id)
        {
            var agoraAppId = await _settingManager.GetSettingValueAsync(AppSettingNames.Agora_AppId);
            var agoraAppCertificate = await _settingManager.GetSettingValueAsync(AppSettingNames.Agora_AppCertificate);
            var role = RtcTokenBuilder.Role.Role_Attendee;
            uint expirationInSeconds = 3600;
            uint currentTimestamp = (uint)DateTime.Now.ToUnixTimestamp();
            uint previledgeTimestamp = currentTimestamp + expirationInSeconds;

            var builder = new RtcTokenBuilder();
            var token = builder.buildTokenWithUid(agoraAppId, agoraAppCertificate, "vc-test", (int)AbpSession.UserId.Value, role, previledgeTimestamp);

            var output = new JoinSessionDto()
            {
                ChannelToken = token,
                Session = new SessionDto(),
            };

            return output;
        }
    }
}
