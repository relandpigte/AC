using System;
using System.Collections.Generic;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Chats.Dto
{
    public class CreateChannelMessageInputDto
    {
        public string Message { get; set; }
        public long? RecipientUserId { get; set; }
        public Guid? ReferenceId { get; set; }
        public Guid? ChannelId { get; set; }
        public Guid? ParentId { get; set; }
        public Guid? ServiceId { get; set; }
        public ServicesType? ServiceType { get; set; }
        public IEnumerable<IFormFile> Attachments { get; set; }
    }
}
