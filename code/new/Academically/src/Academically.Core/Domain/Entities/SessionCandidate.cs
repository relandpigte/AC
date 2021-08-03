using Abp.Domain.Entities;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallySessionCandidates")]
    public class SessionCandidate : Entity<Guid>
    {
        public string Value { get; set; }
        public SessionCandidateType Type { get; set; }
        public Guid SessionId { get; set; }

        [ForeignKey("SessionId")]
        public virtual Session Session { get; set; }
    }
}
