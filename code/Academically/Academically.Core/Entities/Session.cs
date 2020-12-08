using Abp.Domain.Entities;
using Academically.Entities.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallySessions")]
    public class Session : Entity<Guid>
    {
        public string TimeZone { get; set; }
        public DateTime? SessionDate { get; set; }
        public int Duration { get; set; }
        public Guid TutorOfferId { get; set; }
        public SessionStatus Status { get; set; }
    }
}
