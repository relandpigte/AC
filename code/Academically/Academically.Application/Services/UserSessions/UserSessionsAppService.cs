using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.UserSessions.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserSessions
{
    public class UserSessionsAppService : AcademicallyAppServiceBase, IUserSessionsAppService
    {
        private readonly IRepository<Session, Guid> _sessionsRepository;
        public UserSessionsAppService(IRepository<Session, Guid> sessionRepository)
        {
            _sessionsRepository = sessionRepository;
        }


        public async Task SaveSessionDetail(SessionDto input)
        {
            var sessionDetail = new Session();
            ObjectMapper.Map(input, sessionDetail);

            await _sessionsRepository.InsertAsync(sessionDetail);
        }
    }
}
