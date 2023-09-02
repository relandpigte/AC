using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Chats.Dto
{
    public class UpdateChannelMessageInputDto
    {
        public Guid ChannelMessageId { get; set; }
        public string Message { get; set; }
    }
}
