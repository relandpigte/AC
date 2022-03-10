using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.EventPolls.Dto
{
	[AutoMap(typeof(EventPollQuestionOption))]
	public class EventPollQuestionOptionDto : EntityDto<Guid>
	{
		public string Text { get; set; }
		public Guid EventPollQuestionId { get; set; }
	}
}

