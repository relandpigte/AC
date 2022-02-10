using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyCommentReactions")]
    public class CommentReaction : CreationAuditedEntity<Guid>
    {
        public CommentReactionType Type { get; set; }
        public Guid CommentId { get; set; }

        [ForeignKey("CommentId")]
        public Comment Comment { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }
    }
}
