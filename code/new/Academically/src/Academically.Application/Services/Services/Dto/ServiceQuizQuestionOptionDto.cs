using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Services.Dto
{
	[AutoMap(typeof(ServiceQuizQuestionOption))]
	public class ServiceQuizQuestionOptionDto : EntityDto<Guid>
	{
		public string Text { get; set; }
		public Guid ServiceQuizQuestionId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsCorrect { get; set; }

    }
}

