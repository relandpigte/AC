using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Services.Chats.Dto
{
    [AutoMap(typeof(Channel))]
    public class ChannelDto : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public bool IsArchive { get; set; }
        public bool IsActive { get; set; }
        public Guid? ReferenceId { get; set; }
        public UserDto CreatorUser { get; set; }
        public IEnumerable<ChannelMessageDto> Messages { get; set; }
        public IEnumerable<ChannelMemberDto> Members { get; set; }
        public IEnumerable<ChannelNotificationDto> ChannelNotifications { get; set; }
        
        [NotMapped]
        public List<UserBlocking> BlockedUsers { get; set; }
        
        [NotMapped]
        public List<UserBlocking> BlockedByUsers { get; set; }
    }
}
