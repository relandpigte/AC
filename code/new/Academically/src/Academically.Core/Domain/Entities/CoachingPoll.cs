using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("CoachingPolls")]
	public class CoachingPoll : CreationAuditedEntity<Guid>
	{
        public string Name { get; set; }

        public Guid CoachingId { get; set; }

		[ForeignKey("CoachingId")]
        public Coaching Coaching { get; set; }

		[ForeignKey("CreatorUserId")]
		public User CreatorUser { get; set; }

		public virtual ICollection<CoachingPollQuestion> CoachingPollQuestions { get; set; }

		public CoachingPoll()
		{
			CoachingPollQuestions = new HashSet<CoachingPollQuestion>();
		}
	}
}

