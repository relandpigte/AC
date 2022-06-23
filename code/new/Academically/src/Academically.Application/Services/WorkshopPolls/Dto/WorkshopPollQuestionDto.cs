using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.WorkshopPolls.Dto
{
	[AutoMap(typeof(WorkshopPollQuestion))]
	public class WorkshopPollQuestionDto : EntityDto<Guid>
    {
        public string Text { get; set; }
        public WorkshopPollQuestionType Type { get; set; }
        public int? MinimumResponse { get; set; }
        public int? MaximumResponse { get; set; }
        public bool ShareResults { get; set; }
        public Guid WorkshopPollId { get; set; }

        public IEnumerable<WorkshopPollQuestionOptionDto> WorkshopPollQuestionOptions { get; set; }
    }
}

