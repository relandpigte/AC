using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("EventPollQuestionOptions")]
	public class EventPollQuestionOption : Entity<Guid>
	{
        public string Text { get; set; }
        public Guid EventPollQuestionId { get; set; }

		[ForeignKey("EventPollQuestionId")]
		public EventPollQuestion EventPollQuestion { get; set; }

        public EventPollQuestionOption()
		{
		}
	}
}

