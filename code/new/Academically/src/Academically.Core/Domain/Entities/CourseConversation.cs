using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("CourseConversations")]
    public class CourseConversation : CreationAuditedEntity<Guid>
    {
        public string Message { get; set; }
        public bool IsSeen { get; set; }
        public Guid StudentCourseId { get; set; }
        public Guid? ParentId { get; set; }

        public virtual StudentCourse StudentCourse { get; set; }
        public virtual CourseConversation Parent { get; set; }
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<CourseConversation> Children { get; set; }
        public virtual ICollection<CourseConversationReaction> CourseConversationReactions { get; set; }

        public CourseConversation()
        {
            Children = new HashSet<CourseConversation>();
            CourseConversationReactions = new HashSet<CourseConversationReaction>();
        }
    }
}

