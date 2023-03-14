using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("CoachingPollQuestionOptions")]
	public class CoachingPollQuestionOption : Entity<Guid>
	{
        public string Text { get; set; }
        public Guid CoachingPollQuestionId { get; set; }

		[ForeignKey("CoachingPollQuestionId")]
		public CoachingPollQuestion CoachingPollQuestion { get; set; }

        public CoachingPollQuestionOption()
		{
		}
	}
}

