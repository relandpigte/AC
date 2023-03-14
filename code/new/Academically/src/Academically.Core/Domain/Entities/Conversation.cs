using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("Conversations")]
    public class Conversation : CreationAuditedEntity<Guid>
    {
        public Conversation()
        {
            ConversationDocuments = new HashSet<ConversationDocument>();
        }

        public string Message { get; set; }
        public bool IsSeen { get; set; }
        public Guid ConversationGroupId { get; set; }

        [ForeignKey("ConversationGroupId")]
        public virtual ConversationGroup ConversationGroup { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<ConversationDocument> ConversationDocuments { get; set; }
    }
}
