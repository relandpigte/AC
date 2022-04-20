using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.ConferenceSessions.Dto
{
	[AutoMap(typeof(ConferenceSession))]
	public class ConferenceSessionDto : EntityDto<Guid>
	{
		public string Offer { get; set; }
		public string Answer { get; set; }
		public string ReferenceId { get; set; }
		public ConferenceSessionStatus Status { get; set; }

		public IEnumerable<ConferenceSessionCandidateDto> ConferenceSessionCandidates { get; set; }
	}
}

