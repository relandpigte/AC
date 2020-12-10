using System.Collections.Generic;
using Academically.Services.UserProfiles.Dto;

namespace Academically.Services.UserSessions.Dto
{
    public class JoinSessionDto
    {
        public string ChannelName { get; set; }
        public string ChannelToken { get; set; }
        public SessionDto Session { get; set; }
    }
}
