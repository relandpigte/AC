using System.Collections.Generic;
using Academically.Users.Dto;

namespace Academically.Services.Chats.Dto
{
    public class EventUsersResponseDto
    {
        public IEnumerable<UserDto> Joined { get; set; }
        public IEnumerable<UserDto> NotJoined { get; set; }
    }
}