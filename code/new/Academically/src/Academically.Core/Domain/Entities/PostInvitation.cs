using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("PostInvitations")]
	public class PostInvitation : CreationAuditedEntity<Guid>
	{
		public Guid PostId { get; set; }
		public long UserId { get; set; }

		[ForeignKey("PostId")]
		public virtual Post Post { get; set; }

		[ForeignKey("UserId")]
		public virtual User User { get; set; }

		[ForeignKey("CreatorUserId")]
		public virtual User CreatorUser { get; set; }
    }
}

