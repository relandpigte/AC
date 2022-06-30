using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.EventSessions.Dto;
using Academically.Users.Dto;

namespace Academically.Services.EventSessions
{
    public interface IEventSessionsAppService : IApplicationService
    {
        Task<UserDto> GetInvitedUser(Guid invitationId);
        Task<IEnumerable<EventUserDto>> GetUsers(Guid eventId);
	}
}

