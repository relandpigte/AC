using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Auditing;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities
{
    [Table("CourseTopics")]
	public class CourseTopic : CreationAuditedEntity<Guid>
	{
		public Guid CourseId { get; set; }
		public Guid DisciplineTaxonomyId { get; set; }

		[ForeignKey("CourseId")]
		public virtual Course Course { get; set; }

		[ForeignKey("DisciplineTaxonomyId")]
		public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
	}
}

