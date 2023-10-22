using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("EventPollAnswers")]
	public class EventPollAnswer : FullAuditedEntity<Guid>
	{
        public Guid ReferenceId { get; set; }
        public Guid EventPollId { get; set; }
        public Guid EventPollQuestionId { get; set; }
        public Guid EventPollQuestionOptionId { get; set; }
        public DateTime? SubmittedTime { get; set; }
		[ForeignKey("CreatorUserId")]
		public User CreatorUser { get; set; }

    }
}

