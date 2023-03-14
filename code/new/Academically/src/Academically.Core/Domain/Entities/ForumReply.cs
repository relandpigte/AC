using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("ForumReplies")]
	public class ForumReply : CreationAuditedEntity<Guid>
	{
        public Guid ForumId { get; set; }
        public string Message { get; set; }

		[ForeignKey("ForumId")]
        public virtual Forum Forum { get; set; }

		[ForeignKey("CreatorUserId")]
		public virtual User CreatorUser { get; set; }

		public ForumReply()
		{
		}
	}
}

