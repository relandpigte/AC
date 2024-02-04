using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("ServiceQuizQuestions")]
	public class ServiceQuizQuestion : CreationAuditedEntity<Guid>
	{
        public string Text { get; set; }

        public ServiceQuizQuestionType Type { get; set; }

        public Guid ServiceQuizId { get; set; }

        public int DisplayOrder { get; set; }
        public bool IsExplainAnswer { get; set; }
        public string Explanation { get; set; }


        [ForeignKey("ServiceQuizId")]
        public ServiceQuiz ServiceQuiz { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<ServiceQuizQuestionOption> ServiceQuizQuestionOptions { get; set; } = new HashSet<ServiceQuizQuestionOption>();
	}
}

