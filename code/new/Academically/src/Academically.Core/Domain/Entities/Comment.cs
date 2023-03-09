using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyComments")]
    public class Comment : CreationAuditedEntity<Guid>
    {
        public string Body { get; set; }
        public Guid? ParentId { get; set; }
        public string ReferenceId { get; set; }

        public Guid? ServiceId { get; set; }

        public ServicesType? ServiceType { get; set; }

        [ForeignKey("ParentId")]
        public virtual Comment Parent { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<Comment> Children { get; set; }
        public virtual ICollection<CommentReaction> CommentReactions { get; set; }

        public Comment()
        {
            Children = new HashSet<Comment>();
            CommentReactions = new HashSet<CommentReaction>();
        }
    }
}
