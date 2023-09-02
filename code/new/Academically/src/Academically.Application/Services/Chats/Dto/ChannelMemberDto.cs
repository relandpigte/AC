using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using Abp.Domain.Entities.Auditing;

namespace Academically.Services.Chats.Dto
{
    [AutoMap(typeof(ChannelMember))]
    public class ChannelMemberDto : FullAuditedEntity<Guid>
    {
        public long UserId { get; set; }
        public Guid ChannelId { get; set; }
        public UserDto CreatorUser { get; set; }
        public ChannelDto Channel { get; set; }
    }
}
