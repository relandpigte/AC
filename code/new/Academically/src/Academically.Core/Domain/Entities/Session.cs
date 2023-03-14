using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("Sessions")]
    public class Session : Entity<Guid>
    {
        public Session()
        {
            SessionCandidates = new HashSet<SessionCandidate>();
        }

        public string Offer { get; set; }
        public string Answer { get; set; }
        public Guid CalendarEventId { get; set; }

        [ForeignKey("CalendarEventId")]
        public virtual CalendarEvent CalendarEvent { get; set; }

        public virtual ICollection<SessionCandidate> SessionCandidates { get; set; }
    }
}
