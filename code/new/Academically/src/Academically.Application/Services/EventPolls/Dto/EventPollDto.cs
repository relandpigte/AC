using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.EventPolls.Dto
{
	[AutoMap(typeof(EventPoll))]
	public class EventPollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
        public Guid EventId { get; set; }
		public EventPollStatus Status { get; set; }
        public DateTime? LaunchedTime { get; set; }
        public DateTime? EndedTime { get; set; }
        public DateTime? SharedTime { get; set; }
        public DateTime CreationTime { get; set; }
		public long CreatorUserId { get; set; }

        public IEnumerable<EventPollQuestionDto> EventPollQuestions { get; set; }
	}
}

