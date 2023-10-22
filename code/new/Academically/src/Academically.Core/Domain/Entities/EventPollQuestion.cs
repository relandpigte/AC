using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("EventPollQuestions")]
	public class EventPollQuestion : CreationAuditedEntity<Guid>
	{
        public string Text { get; set; }
        public EventPollQuestionType Type { get; set; }
        public int? MinimumResponse { get; set; }
        public int? MaximumResponse { get; set; }
        public bool ShareResults { get; set; }
        public Guid EventPollId { get; set; }

        [ForeignKey("EventPollId")]
        public EventPoll EventPoll { get; set; }
        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<EventPollQuestionOption> EventPollQuestionOptions { get; set; }
        public virtual ICollection<EventPollAnswer> EventPollAnswers { get; set; }

        public EventPollQuestion()
		{
            EventPollQuestionOptions = new HashSet<EventPollQuestionOption>();
        }
	}
}

