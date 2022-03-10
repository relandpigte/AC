using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.EventPolls.Dto
{
	[AutoMapTo(typeof(EventPoll))]
	public class CreateEventPollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
		public Guid EventId { get; set; }

		public IEnumerable<EventPollQuestionDto> EventPollQuestions { get; set; }
	}
}

