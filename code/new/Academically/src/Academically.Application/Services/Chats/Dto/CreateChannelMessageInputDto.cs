using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Chats.Dto
{
    public class CreateChannelMessageInputDto
    {
        public string Message { get; set; }
        public long RecipientUserId { get; set; }
        public Guid? ChannelId { get; set; }
        public Guid? ParentId { get; set; }
    }
}
