using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
	[AutoMapTo(typeof(ServicePollQuestion))]
	public class CreateServicePollQuestionDto : EntityDto<Guid>
	{
        public string Text { get; set; }
        public ServicePollQuestionType Type { get; set; }
        public Guid ServicePollId { get; set; }
        public IEnumerable<CreateServicePollQuestionOptionDto> ServicePollQuestionOptions { get; set; }

        [NotMapped]
        public bool IsTemporary { get; set; }
	}
}

