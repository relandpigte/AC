using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("ServicePollQuestions")]
	public class ServicePollQuestion : CreationAuditedEntity<Guid>
	{
        public string Text { get; set; }

        public ServicePollQuestionType Type { get; set; }

        public Guid ServicePollId { get; set; }

        public int DisplayOrder { get; set; }

        [ForeignKey("ServicePollId")]
        public ServicePoll ServicePoll { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<ServicePollQuestionOption> ServicePollQuestionOptions { get; set; } = new HashSet<ServicePollQuestionOption>();
	}
}

