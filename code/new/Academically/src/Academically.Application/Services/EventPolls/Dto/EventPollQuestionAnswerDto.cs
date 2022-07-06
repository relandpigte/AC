using System;
using System.Collections.Generic;
using Academically.Users.Dto;

namespace Academically.Services.EventPolls.Dto
{
	public class EventPollQuestionAnswerDto
    {
        public Guid EventPollQuestionId { get; set; }
        public UserDto CreatorUser { get; set; }

        public IEnumerable<Guid> EventPollQuestionOptionIds { get; set; }
    }
}

