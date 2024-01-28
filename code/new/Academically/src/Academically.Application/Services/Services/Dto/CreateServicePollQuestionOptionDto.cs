using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
	[AutoMapTo(typeof(ServicePollQuestionOption))]
	public class CreateServicePollQuestionOptionDto : EntityDto<Guid>
	{
        public string Text { get; set; }
        public Guid ServicePollQuestionId { get; set; }

        [NotMapped]
        public bool IsTemporary { get; set; }
	}
}

