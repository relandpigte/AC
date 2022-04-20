using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyConferenceSessionCandidates")]
	public class ConferenceSessionCandidate : Entity<Guid>
	{
        public string Value { get; set; }
        public SessionCandidateType Type { get; set; }
        public Guid ConferenceSessionId { get; set; }

        [ForeignKey("ConferenceSessionId")]
        public ConferenceSession ConferenceSession { get; set; }

        public ConferenceSessionCandidate()
		{
		}
	}
}

