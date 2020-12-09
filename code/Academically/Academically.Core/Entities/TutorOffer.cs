using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Entities
{
    [Table("AcademicallyTutorOffers")]
    public class TutorOffer : Entity<Guid>
    {
        public Guid TutorialId { get; set; }
        public Guid TutorId { get; set; }
        public bool? IsAccepted { get; set; }
        public bool IsSubmitted { get; set; }
        public DateTime CreationTime { get; set; }
        public string CoverLetter { get; set; }
        public decimal SingleSessionRate { get; set; }
        public decimal MultipleSessionRate { get; set; }
        public int MultipleSessionCount { get; set; }
        public DateTime? AcceptedDate { get; set; }

        [ForeignKey("TutorId")]
        public virtual UserProfile Tutor { get; set; }

        public virtual Session Session { get; set; }
    }
}
