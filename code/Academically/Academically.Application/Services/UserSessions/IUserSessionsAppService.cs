using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserSessions.Dto;

namespace Academically.Services.UserSessions
{
    public interface IUserSessionsAppService : IApplicationService
    {
        Task<IEnumerable<SessionDto>> GetUpcomingAsync(bool isStudent = false);
        Task CreateAsync(SessionDto input);
        Task<JoinSessionDto> JoinAsync(Guid id);
    }
}
