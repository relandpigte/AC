using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities
{
    [Table("ChannelMessageAttachments")]
    public class ChannelMessageAttachment : CreationAuditedEntity<Guid>
    {
        public Guid ChannelMessageId { get; set; }
        public Guid DocumentId { get; set; }

        [ForeignKey("ChannelMessageId")]
        public virtual ChannelMessage ChannelMessage { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }
    }
}