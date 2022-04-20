using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.ConferenceSessions.Dto
{
	[AutoMap(typeof(ConferenceSessionCandidate))]
	public class ConferenceSessionCandidateDto : EntityDto<Guid>
	{
		public string Value { get; set; }
		public SessionCandidateType Type { get; set; }
		public Guid ConferenceSessionId { get; set; }
	}
}

