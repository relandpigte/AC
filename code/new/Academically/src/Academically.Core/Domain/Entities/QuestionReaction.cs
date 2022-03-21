using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyQuestionReactions")]
    public class QuestionReaction : CreationAuditedEntity<Guid>
    {
        public ReactionType Type { get; set; }
        public Guid QuestionId { get; set; }

        [ForeignKey("QuestionId")]
        public Question Question { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }
    }
}

