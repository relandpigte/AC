using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyConversationDocuments")]
    public class ConversationDocument : Entity<Guid>
    {
        public Guid ConversationId { get; set; }
        public Guid DocumentId { get; set; }

        public virtual Conversation Conversation { get; set; }
        public virtual Document Document { get; set; }
    }
}
