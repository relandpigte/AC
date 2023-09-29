using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ChannelMessages")]
    public class ChannelMessage : FullAuditedEntity<Guid>
    {
        public ChannelMessage()
        {
            ChannelMessageAttachments = new HashSet<ChannelMessageAttachment>();
        }
        public string Message { get; set; }

        public DateTime? IsSeen { get; set; }

        public Guid? ParentId { get; set; }

        public Guid ChannelId { get; set; }
        
        public Guid? ServiceId { get; set; }

        public ServicesType? ServiceType { get; set; }

        public Guid? ReferenceId { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("ParentId")]
        public virtual ChannelMessage Parent { get; set; }

        [ForeignKey("ChannelId")]
        public virtual Channel Channel { get; set; }
        
        public virtual ICollection<ChannelMessageAttachment> ChannelMessageAttachments { get; set; }
    }
}
