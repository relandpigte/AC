using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyWorkshopPollQuestions")]
	public class WorkshopPollQuestion : CreationAuditedEntity<Guid>
	{
        public string Text { get; set; }
        public WorkshopPollQuestionType Type { get; set; }
        public int? MinimumResponse { get; set; }
        public int? MaximumResponse { get; set; }
        public bool ShareResults { get; set; }
        public Guid WorkshopPollId { get; set; }

        [ForeignKey("WorkshopPollId")]
        public WorkshopPoll WorkshopPoll { get; set; }
        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<WorkshopPollQuestionOption> WorkshopPollQuestionOptions { get; set; }

        public WorkshopPollQuestion()
		{
            WorkshopPollQuestionOptions = new HashSet<WorkshopPollQuestionOption>();
        }
	}
}

