using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyTutorOffers")]
    public class TutorOffer : Entity<Guid>
    {
        public Guid TutorialId { get; set; }
        public long TutorId { get; set; }
        public bool? IsAccepted { get; set; }
        public bool IsSubmitted { get; set; }
        public DateTime CreationTime { get; set; }
        public string CoverLetter { get; set; }
        public decimal SingleSessionRate { get; set; }
        public decimal MultipleSessionRate { get; set; }
        public int MultipleSessionCount { get; set; }
        public DateTime? AcceptedDate { get; set; }
    }
}
