using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
	[AutoMapTo(typeof(ServiceQuizQuestion))]
	public class CreateServiceQuizQuestionDto : EntityDto<Guid>
	{
        public string Text { get; set; }
        public ServiceQuizQuestionType Type { get; set; }
        public Guid ServiceQuizId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsExplainAnswer { get; set; }
        public string Explanation { get; set; }
        public IEnumerable<CreateServiceQuizQuestionOptionDto> ServiceQuizQuestionOptions { get; set; }

        [NotMapped]
        public bool IsTemporary { get; set; }
	}
}

