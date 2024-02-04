using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
	[AutoMap(typeof(ServiceQuiz))]
	public class ServiceQuizDto : EntityDto<Guid>
	{
		public string Name { get; set; }
        public int Duration { get; set; }
        public ServiceQuizTrigger Trigger { get; set; }
        public Guid ReferenceId { get; set; }
        public ServicesType ServiceType { get; set; }
        public DateTime CreationTime { get; set; }
        public IEnumerable<ServiceQuizQuestionDto> ServiceQuizQuestions { get; set; }
	}
}

