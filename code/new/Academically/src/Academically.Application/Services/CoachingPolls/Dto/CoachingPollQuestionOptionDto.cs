using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.CoachingPolls.Dto
{
	[AutoMap(typeof(CoachingPollQuestionOption))]
	public class CoachingPollQuestionOptionDto : EntityDto<Guid>
	{
		public string Text { get; set; }
		public Guid CoachingPollQuestionId { get; set; }
	}
}

