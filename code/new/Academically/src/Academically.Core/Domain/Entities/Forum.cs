using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("Forums")]
	public class Forum : CreationAuditedEntity<Guid>
	{
        public string Message { get; set; }

		[ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<ForumReply> ForumReplies { get; set; }
        public virtual ICollection<ForumTopic> ForumTopics { get; set; }

		public Forum()
		{
			ForumReplies = new HashSet<ForumReply>();
			ForumTopics = new HashSet<ForumTopic>();
		}
	}
}

