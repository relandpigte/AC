using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.WorkshopPolls.Dto
{
	[AutoMap(typeof(WorkshopPoll))]
	public class WorkshopPollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
        public DateTime CreationTime { get; set; }

        public IEnumerable<WorkshopPollQuestionDto> WorkshopPollQuestions { get; set; }
	}
}

