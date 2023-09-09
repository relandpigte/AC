using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Chats.Dto
{
    public class MatchedChannelsDto
    {
        public ChannelDto Channel { get; set; }
        public int MatchCount { get; set; }
    }

    public class SearchByKeywordResponseDto
    {
        public string Keyword { get; set; }
        public IEnumerable<UserDto> Users { get; set; }
        public IEnumerable<MatchedChannelsDto> Channels { get; set; }
    }
}
