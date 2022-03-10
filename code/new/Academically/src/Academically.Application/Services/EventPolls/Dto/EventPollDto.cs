using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.EventPolls.Dto
{
	[AutoMap(typeof(EventPoll))]
	public class EventPollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
        public DateTime CreationTime { get; set; }

        public IEnumerable<EventPollQuestionDto> EventPollQuestions { get; set; }
	}
}

