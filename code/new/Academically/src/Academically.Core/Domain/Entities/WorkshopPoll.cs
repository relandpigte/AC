using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyWorkshopPolls")]
	public class WorkshopPoll : CreationAuditedEntity<Guid>
	{
        public string Name { get; set; }

        public Guid WorkshopId { get; set; }

		[ForeignKey("WorkshopId")]
        public Workshop Workshop { get; set; }

		[ForeignKey("CreatorUserId")]
		public User CreatorUser { get; set; }

		public virtual ICollection<WorkshopPollQuestion> WorkshopPollQuestions { get; set; }

		public WorkshopPoll()
		{
			WorkshopPollQuestions = new HashSet<WorkshopPollQuestion>();
		}
	}
}

