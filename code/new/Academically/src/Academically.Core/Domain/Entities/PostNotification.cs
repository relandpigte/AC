using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyPostNotification")]
	public class PostNotification : CreationAuditedEntity<Guid>
	{
		public Guid PostId { get; set; }
		public long? NotifyUserId { get; set; }

		[ForeignKey("PostId")]
		public virtual Post Post { get; set; }

		[ForeignKey("NotifyUserId")]
		public virtual User User { get; set; }
	}
}

