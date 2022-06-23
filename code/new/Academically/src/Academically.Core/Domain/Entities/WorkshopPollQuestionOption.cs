using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyWorkshopPollQuestionOptions")]
	public class WorkshopPollQuestionOption : Entity<Guid>
	{
        public string Text { get; set; }
        public Guid WorkshopPollQuestionId { get; set; }

		[ForeignKey("WorkshopPollQuestionId")]
		public WorkshopPollQuestion WorkshopPollQuestion { get; set; }

        public WorkshopPollQuestionOption()
		{
		}
	}
}

