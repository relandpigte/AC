using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("PostNotification")]
	public class PostNotification : CreationAuditedEntity<Guid>
	{
		public Guid PostId { get; set; }

		[ForeignKey("PostId")]
		public virtual Post Post { get; set; }

		[ForeignKey("CreatorUserId")]
		public virtual User User { get; set; }
    }
}

