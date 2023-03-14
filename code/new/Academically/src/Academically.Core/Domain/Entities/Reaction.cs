using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("Reactions")]
	public class Reaction : CreationAuditedEntity<Guid>
	{
        public ReactionType Type { get; set; }
        public string ReferenceId { get; set; }
    }
}

