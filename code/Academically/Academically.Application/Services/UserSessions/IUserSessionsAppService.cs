using Abp.Application.Services;
using Academically.Services.UserSessions.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserSessions
{
    public interface IUserSessionsAppService: IApplicationService
    {
        Task SaveSessionDetail(SessionDto input);
    }
}
