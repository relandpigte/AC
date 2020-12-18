using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Academically.Configuration;
using Academically.DomainServices.Timezone;
using Academically.Entities;
using Academically.Services.UserProfiles.Dto;
using Academically.Services.UserSessions.Dto;
using AgoraIO.Media;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserSessions
{
    public class UserSessionsAppService : AcademicallyAppServiceBase, IUserSessionsAppService
    {
        private readonly IRepository<Session, Guid> _sessionsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly ITimezoneDomainService _timezoneDomainService;
        private readonly ISettingManager _settingManager;

        public UserSessionsAppService(
            IRepository<Session, Guid> sessionRepository,
            IRepository<UserProfile, Guid> userProfilesRepository,
            ITimezoneDomainService timezoneDomainService,
            ISettingManager settingManager
            )
        {
            _sessionsRepository = sessionRepository;
            _settingManager = settingManager;
            _timezoneDomainService = timezoneDomainService;
            _userProfilesRepository = userProfilesRepository;
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

            var sessions = await sessionsQuery.OrderBy(e => e.SessionDate)
                .Take(5)
                .Select(e => ObjectMapper.Map<SessionDto>(e))
                .ToListAsync();

            return sessions;
        }

        public async Task SaveAsync(SessionDto input)
        {
            var sessionDetail = await _sessionsRepository.FirstOrDefaultAsync(e => e.Id == input.Id);
            if(sessionDetail == null)
            {
                sessionDetail = new Session();
                var studentProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
                input.SessionDate = _timezoneDomainService.ConvertToUtc(input.SessionDate, studentProfile.TimezoneId);
            }

            ObjectMapper.Map(input, sessionDetail);
            await _sessionsRepository.InsertOrUpdateAsync(sessionDetail);
        }

        public async Task<JoinSessionDto> JoinAsync(Guid id)
        {
            var agoraAppId = await _settingManager.GetSettingValueAsync(AppSettingNames.Agora_AppId);
            var agoraAppCertificate = await _settingManager.GetSettingValueAsync(AppSettingNames.Agora_AppCertificate);
            var role = RtcTokenBuilder.Role.Role_Attendee;
            uint expirationInSeconds = 3600;
            uint currentTimestamp = (uint)DateTime.Now.ToUnixTimestamp();
            uint previledgeTimestamp = currentTimestamp + expirationInSeconds;
            string channelName = id.ToString();
            var builder = new RtcTokenBuilder();
            var token = builder.buildTokenWithUid(agoraAppId, agoraAppCertificate, channelName, (int)AbpSession.UserId.Value, role, previledgeTimestamp);

            var session = await _sessionsRepository.GetAll()
                .Include(e => e.TutorOffer)
                    .ThenInclude(e => e.Tutor)
                        .ThenInclude(e => e.User)
                .Include(e => e.TutorOffer)
                    .ThenInclude(e => e.Tutorial)
                        .ThenInclude(e => e.Student)
                            .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);

            var sessionDto = ObjectMapper.Map<SessionDto>(session);

            var output = new JoinSessionDto()
            {
                ChannelName = channelName,
                ChannelToken = token,
                Session = sessionDto,
            };

            return output;
        }
    }
}
