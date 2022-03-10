using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.EventPolls.Dto
{
	[AutoMap(typeof(EventPollQuestion))]
	public class EventPollQuestionDto : EntityDto<Guid>
    {
        public string Text { get; set; }
        public EventPollQuestionType Type { get; set; }
        public int? MinimumResponse { get; set; }
        public int? MaximumResponse { get; set; }
        public bool ShareResults { get; set; }
        public Guid EventPollId { get; set; }

        public IEnumerable<EventPollQuestionOptionDto> EventPollQuestionOptions { get; set; }
    }
}

