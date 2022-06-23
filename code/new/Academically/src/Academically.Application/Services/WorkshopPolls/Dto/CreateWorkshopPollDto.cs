using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.WorkshopPolls.Dto
{
	[AutoMapTo(typeof(WorkshopPoll))]
	public class CreateWorkshopPollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
		public Guid WorkshopId { get; set; }

		public IEnumerable<WorkshopPollQuestionDto> WorkshopPollQuestions { get; set; }
	}
}

