using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("Questions")]
    public class Question : CreationAuditedEntity<Guid>
    {
        public string Body { get; set; }
        public Guid? ParentId { get; set; }
        public string ReferenceId { get; set; }

        [ForeignKey("ParentId")]
        public virtual Question Parent { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<Question> Children { get; set; }
        public virtual ICollection<QuestionReaction> QuestionReactions { get; set; }

        public Question()
        {
            Children = new HashSet<Question>();
            QuestionReactions = new HashSet<QuestionReaction>();
        }
    }
}
