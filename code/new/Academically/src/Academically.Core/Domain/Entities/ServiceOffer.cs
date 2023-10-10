using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ServiceOffers")]
    public class ServiceOffer: FullAuditedEntity<Guid>
    {
        public Guid ReferenceId { get; set; }
        public Guid ServiceId { get; set; }
        public double? PercentageDiscount { get; set; }
        public decimal? DiscountAmount { get; set; }
        public bool IsOfferDurationLimited { get; set; } = false;
        public int? OfferLimitDays { get; set; }
        public int? OfferLimitHours { get; set; }
        public int? OfferLimitMinutes { get; set; }
        public bool IsNumberOfUnitsLimited { get; set; } = false;
        public int? UnitLimit { get; set; }
    }
}
