using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
	[AutoMap(typeof(ServicePollQuestion))]
	public class ServicePollQuestionDto : EntityDto<Guid>
    {
        public string Text { get; set; }
        public ServicePollQuestionType Type { get; set; }
        public Guid ServicePollId { get; set; }
        public int DisplayOrder { get; set; }
        public IEnumerable<ServicePollQuestionOptionDto> ServicePollQuestionOptions { get; set; }
    }
}

