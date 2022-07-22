using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyEventOffers")]
    public class EventOffer: CreationAuditedEntity<Guid>
    {
        public Guid EventId { get; set; }
        public bool IsNotDiscounted { get; set; } = false;
        public bool IsDiscountedByPercentage { get; set; } = false;
        public double PercentageDiscount { get; set; } = 0;
        public bool IsDiscountedByAmount { get; set; } = false;
        public decimal DiscountAmount { get; set; } = decimal.Zero;
        public bool IsSalesDisplayedInRealtime { get; set; } = false;
        public bool IsNumberOfUnitsLimited { get; set; } = false;
        public int UnitLimit { get; set; } = 0;
        public bool IsOfferDurationLimited { get; set; } = false;
        public int OfferLimitHours { get; set; } = 0;
        public int OfferLimitMinutes { get; set; } = 0;
        public int OfferLimitSeconds { get; set; } = 0;

        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}
