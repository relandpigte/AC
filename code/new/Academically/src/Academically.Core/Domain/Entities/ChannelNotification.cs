using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ChannelNotifications")]
    public class ChannelNotification : CreationAuditedEntity<Guid>
    {
        public Guid ChannelId { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("ChannelId")]
        public virtual Channel Channel { get; set; }
    }
}