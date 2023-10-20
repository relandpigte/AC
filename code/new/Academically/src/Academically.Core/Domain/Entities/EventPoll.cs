using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("EventPolls")]
	public class EventPoll : CreationAuditedEntity<Guid>
	{
        public string Name { get; set; }
        public Guid EventId { get; set; }
		public EventPollStatus Status { get; set; }

        [ForeignKey("EventId")]
        public Event Event { get; set; }
		[ForeignKey("CreatorUserId")]
		public User CreatorUser { get; set; }

		public virtual ICollection<EventPollQuestion> EventPollQuestions { get; set; }

		public EventPoll()
		{
			EventPollQuestions = new HashSet<EventPollQuestion>();
		}
	}
}

