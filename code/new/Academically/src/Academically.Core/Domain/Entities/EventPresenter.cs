using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyEventPresenters")]
	public class EventPresenter : CreationAuditedEntity<Guid>
	{
        public EventPresenterType Type { get; set; }
        public Guid EventId { get; set; }
        public long UserId { get; set; }
        public EventPresenterStatus Status { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public EventPresenter()
		{
		}
	}
}

