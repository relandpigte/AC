using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.CoachingPolls.Dto
{
	[AutoMap(typeof(CoachingPoll))]
	public class CoachingPollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
        public DateTime CreationTime { get; set; }

        public IEnumerable<CoachingPollQuestionDto> CoachingPollQuestions { get; set; }
	}
}

