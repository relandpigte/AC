using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("CoachingPollQuestions")]
	public class CoachingPollQuestion : CreationAuditedEntity<Guid>
	{
        public string Text { get; set; }
        public CoachingPollQuestionType Type { get; set; }
        public int? MinimumResponse { get; set; }
        public int? MaximumResponse { get; set; }
        public bool ShareResults { get; set; }
        public Guid CoachingPollId { get; set; }

        [ForeignKey("CoachingPollId")]
        public CoachingPoll CoachingPoll { get; set; }
        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<CoachingPollQuestionOption> CoachingPollQuestionOptions { get; set; }

        public CoachingPollQuestion()
		{
            CoachingPollQuestionOptions = new HashSet<CoachingPollQuestionOption>();
        }
	}
}

