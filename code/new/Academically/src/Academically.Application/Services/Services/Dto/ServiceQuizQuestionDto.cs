using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
	[AutoMap(typeof(ServiceQuizQuestion))]
	public class ServiceQuizQuestionDto : EntityDto<Guid>
    {
        public string Text { get; set; }
        public ServiceQuizQuestionType Type { get; set; }
        public Guid ServiceQuizId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsExplainAnswer { get; set; }
        public string Explanation { get; set; }
        public IEnumerable<ServiceQuizQuestionOptionDto> ServiceQuizQuestionOptions { get; set; }
    }
}

