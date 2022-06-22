using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.CoachingPolls.Dto
{
	[AutoMapTo(typeof(CoachingPoll))]
	public class CreateCoachingPollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
		public Guid CoachingId { get; set; }

		public IEnumerable<CoachingPollQuestionDto> CoachingPollQuestions { get; set; }
	}
}

