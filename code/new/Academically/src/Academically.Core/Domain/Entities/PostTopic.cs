using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Auditing;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities
{
    [Table("PostTopics")]
	[Audited]
	public class PostTopic : CreationAuditedEntity<Guid>
	{
		public Guid PostId { get; set; }
		public Guid DisciplineTaxonomyId { get; set; }

		[ForeignKey("PostId")]
		public virtual Post Post { get; set; }

		[ForeignKey("DisciplineTaxonomyId")]
		public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
	}
}

