using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyConferenceSessions")]
	public class ConferenceSession : Entity<Guid>
	{
        public string Offer { get; set; }
        public string Answer { get; set; }
        public string ReferenceId { get; set; }
        public ConferenceSessionStatus Status { get; set; }

        public virtual ICollection<ConferenceSessionCandidate> ConferenceSessionCandidates { get; set; }

        public ConferenceSession()
        {
            ConferenceSessionCandidates = new HashSet<ConferenceSessionCandidate>();
        }
    }
}

