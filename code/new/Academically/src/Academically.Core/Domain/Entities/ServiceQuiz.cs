using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("servicequizes")]
	public class ServiceQuiz : CreationAuditedEntity<Guid>
	{
        public string Name { get; set; }

        public string Description { get; set; }

        public int Duration { get; set; }

        public ServiceQuizTrigger Trigger { get; set; }

        public Guid ReferenceId { get; set; }

        public ServicesType ServiceType { get; set; }

        [ForeignKey("CreatorUserId")]
		public User CreatorUser { get; set; }

		public virtual ICollection<ServiceQuizQuestion> ServiceQuizQuestions { get; set; } = new HashSet<ServiceQuizQuestion>();
	}
}

