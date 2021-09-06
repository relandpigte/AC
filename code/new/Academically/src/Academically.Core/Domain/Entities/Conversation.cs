using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyConversations")]
    public class Conversation : CreationAuditedEntity<Guid>
    {
        public string Message { get; set; }
        public bool IsSeen { get; set; }
        public Guid ConversationGroupId { get; set; }

        [ForeignKey("ConversationGroupId")]
        public virtual ConversationGroup ConversationGroup { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}
