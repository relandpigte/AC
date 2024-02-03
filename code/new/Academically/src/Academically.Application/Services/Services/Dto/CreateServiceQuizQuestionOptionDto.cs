using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Services.Dto
{
    [AutoMapTo(typeof(ServiceQuizQuestionOption))]
	public class CreateServiceQuizQuestionOptionDto : EntityDto<Guid>
	{
        public string Text { get; set; }
        public Guid ServiceQuizQuestionId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsCorrect { get; set; }


        [NotMapped]
        public bool IsTemporary { get; set; }
	}
}

