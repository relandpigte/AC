using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.CoachingPolls.Dto
{
	[AutoMap(typeof(CoachingPollQuestion))]
	public class CoachingPollQuestionDto : EntityDto<Guid>
    {
        public string Text { get; set; }
        public CoachingPollQuestionType Type { get; set; }
        public int? MinimumResponse { get; set; }
        public int? MaximumResponse { get; set; }
        public bool ShareResults { get; set; }
        public Guid CoachingPollId { get; set; }

        public IEnumerable<CoachingPollQuestionOptionDto> CoachingPollQuestionOptions { get; set; }
    }
}

