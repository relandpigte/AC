using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("Channels")]
    public class Channel : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }

        public bool IsArchive { get; set; }

        public bool IsActive { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<ChannelMessage> Messages { get; set; }

        public virtual ICollection<ChannelMember> Members { get; set; }
    }
}
