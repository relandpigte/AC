using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.EventPolls.Dto
{
    [AutoMap(typeof(EventPollAnswer))]
    public class UpsertEventPollAnswerDto
	{
        public Guid ReferenceId { get; set; }
        public Guid EventPollId { get; set; }
        public Guid EventPollQuestionId { get; set; }
        public Guid EventPollQuestionOptionId { get; set; }
        public long CreatorUserId { get; set; }
    }
}

