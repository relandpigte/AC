using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyWorkshopPresenters")]
	public class WorkshopPresenter : CreationAuditedEntity<Guid>
	{
        public WorkshopPresenterType Type { get; set; }
        public Guid WorkshopId { get; set; }
        public long? UserId { get; set; }
        public string Email { get; set; }
        public WorkshopPresenterStatus Status { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("WorkshopId")]
        public virtual Workshop Workshop { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public WorkshopPresenter()
		{
		}
	}
}

