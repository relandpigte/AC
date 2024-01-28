using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
	[AutoMapTo(typeof(ServicePoll))]
	public class CreateServicePollDto : EntityDto<Guid>
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public int Duration { get; set; }
		public ServicePollTrigger Trigger { get; set; }
		public Guid ReferenceId { get; set; }
		public ServicesType ServiceType { get; set; }
		public IEnumerable<CreateServicePollQuestionDto> ServicePollQuestions { get; set; }

		[NotMapped]
		public bool IsTemporary { get; set; }
	}
}

