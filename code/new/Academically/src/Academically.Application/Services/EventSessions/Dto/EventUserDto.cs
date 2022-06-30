using System;
using Academically.Users.Dto;

namespace Academically.Services.EventSessions.Dto
{
	public class EventUserDto
	{
        public EventUserType Type { get; set; }
        public UserDto User { get; set; }
    }
}

