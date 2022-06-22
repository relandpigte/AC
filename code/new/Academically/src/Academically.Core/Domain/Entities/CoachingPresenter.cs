using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyCoachingPresenters")]
	public class CoachingPresenter : CreationAuditedEntity<Guid>
	{
        public CoachingPresenterType Type { get; set; }
        public Guid CoachingId { get; set; }
        public long? UserId { get; set; }
        public string Email { get; set; }
        public CoachingPresenterStatus Status { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("CoachingId")]
        public virtual Coaching Coaching { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public CoachingPresenter()
		{
		}
	}
}

