using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Services.Dto
{
	[AutoMap(typeof(ServicePollQuestionOption))]
	public class ServicePollQuestionOptionDto : EntityDto<Guid>
	{
		public string Text { get; set; }
		public Guid ServicePollQuestionId { get; set; }
        public int DisplayOrder { get; set; }
    }
}

