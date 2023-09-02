using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ChannelMembers")]
    public class ChannelMember : FullAuditedEntity<Guid>
    {
        public long UserId { get; set; }

        public Guid ChannelId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("ChannelId")]
        public virtual Channel Channel { get; set; }
    }
}
