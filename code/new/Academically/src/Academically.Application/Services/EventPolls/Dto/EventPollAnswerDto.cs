using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;

namespace Academically.Services.EventPolls.Dto
{
	[AutoMap(typeof(EventPollAnswer))]
	public class EventPollAnswerDto : FullAuditedEntityDto<Guid>
	{
        public Guid ReferenceId { get; set; }
        public Guid EventPollId { get; set; }
        public Guid EventPollQuestionId { get; set; }
        public Guid EventPollQuestionOptionId { get; set; }
        public DateTime? SubmittedTime { get; set; }
        public long CreatorUserId { get; set; }
        public UserDto CreatorUser { get; set; }
	}
}

