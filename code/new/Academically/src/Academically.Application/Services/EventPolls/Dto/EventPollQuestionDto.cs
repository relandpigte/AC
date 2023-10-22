using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
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

        [NotMapped]
        public bool IsAnswersReady
        {
            get
            {
                if (this.EventPollAnswers == null || this.EventPollAnswers.Count() == 0) return false;
                if (MinimumResponse.HasValue && this.EventPollAnswers.Count() < MinimumResponse.Value) return false;
                if (MaximumResponse.HasValue && this.EventPollAnswers.Count() > MaximumResponse.Value) return false;
                return true;
            }
        }

        [NotMapped]
        public bool HasBeenAnswered
        {
            get {
                if (!this.IsAnswersReady) return false;
                if (this.EventPollAnswers.Any(a => a.SubmittedTime == null)) return false;
                return true;
            }
        }

        public IEnumerable<EventPollQuestionOptionDto> EventPollQuestionOptions { get; set; }
        public IEnumerable<EventPollAnswerDto> EventPollAnswers { get; set; }
    }
}

