using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyCoachingResources")]
    public class CoachingResource : CreationAuditedEntity<Guid>
	{
        public string Name { get; set; }
        public CoachingResourceType Type { get; set; }
        public Guid CoachingId { get; set; }
        public Guid? DocumentId { get; set; }

        [ForeignKey("CoachingId")]
        public Coaching Coaching { get; set; }

        [ForeignKey("DocumentId")]
        public Document Document { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public CoachingResource()
		{
		}
	}
}

