using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("CourseConversationReactions")]
    public class CourseConversationReaction : CreationAuditedEntity<Guid>
    {
        public ConversationReactionType Type { get; set; }
        public Guid CourseConversationId { get; set; }

        [ForeignKey("CourseConversationId")]
        public virtual CourseConversation CourseConversation { get; set; }

        public CourseConversationReaction()
        {
        }
    }
}

