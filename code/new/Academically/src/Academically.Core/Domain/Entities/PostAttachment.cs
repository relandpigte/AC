using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities
{
    [Table("PostAttachments")]
	public class PostAttachment : CreationAuditedEntity<Guid>
	{
		public Guid PostId { get; set; }
		public Guid DocumentId { get; set; }

		[ForeignKey("PostId")]
		public virtual Post Post { get; set; }

		[ForeignKey("DocumentId")]
		public virtual Document Document { get; set; }
	}
}

