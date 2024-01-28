using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("ServicePollQuestionOptions")]
	public class ServicePollQuestionOption : Entity<Guid>
	{
        public string Text { get; set; }
        public Guid ServicePollQuestionId { get; set; }

		[ForeignKey("ServicePollQuestionId")]
		public ServicePollQuestion ServicePollQuestion { get; set; }
	}
}

