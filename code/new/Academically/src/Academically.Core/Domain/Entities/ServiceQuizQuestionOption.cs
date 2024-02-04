using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("ServiceQuizQuestionOptions")]
	public class ServiceQuizQuestionOption : Entity<Guid>
	{
        public string Text { get; set; }
        public Guid ServiceQuizQuestionId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsCorrect { get; set; }

        [ForeignKey("ServiceQuizQuestionId")]
		public ServiceQuizQuestion ServiceQuizQuestion { get; set; }
	}
}

