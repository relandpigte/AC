using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.EventOffers.Dto
{
    [AutoMapFrom(typeof(EventOffer))]
    public  class EventOfferDto: CreationAuditedEntityDto<Guid>
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
    }
}
