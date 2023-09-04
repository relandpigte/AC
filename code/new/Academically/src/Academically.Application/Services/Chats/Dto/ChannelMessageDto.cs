using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using Abp.Domain.Entities.Auditing;

namespace Academically.Services.Chats.Dto
{
    [AutoMap(typeof(ChannelMessage))]
    public class ChannelMessageDto : FullAuditedEntity<Guid>
    {
        public string Message { get; set; }
        public DateTime? IsSeen { get; set; }
        public Guid? ParentId { get; set; }
        public Guid ChannelId { get; set; }
        public UserDto CreatorUser { get; set; }
        public ChannelMessageDto Parent { get; set; }
        public ChannelDto Channel { get; set; }
    }
}
