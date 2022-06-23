using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.WorkshopPolls.Dto
{
	[AutoMap(typeof(WorkshopPollQuestionOption))]
	public class WorkshopPollQuestionOptionDto : EntityDto<Guid>
	{
		public string Text { get; set; }
		public Guid WorkshopPollQuestionId { get; set; }
	}
}

