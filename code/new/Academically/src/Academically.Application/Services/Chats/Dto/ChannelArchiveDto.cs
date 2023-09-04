using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using Abp.Domain.Entities.Auditing;

namespace Academically.Services.Chats.Dto
{
    [AutoMap(typeof(ChannelArchive))]
    public class ChannelArchiveDto : FullAuditedEntity<Guid>
    {
        public Guid ChannelId { get; set; }
        public UserDto CreatorUser { get; set; }
        public ChannelDto Channel { get; set; }
    }
}
