using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyProjectOffers")]
    public class ProjectOffer : CreationAuditedEntity<Guid>
    {
        public Guid ProjectId { get; set; }
        public bool IsHourlySessionOffered { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsDiscountedHourlySessionOffered { get; set; }
        public double DiscountedHours { get; set; }
        public decimal DiscountedHourlyRate { get; set; }
        public bool IsFreeSessionOffered { get; set; }

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }
    }
}
