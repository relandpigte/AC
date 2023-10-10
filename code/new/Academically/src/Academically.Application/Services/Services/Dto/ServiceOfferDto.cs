using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Services.Services.Dto
{
    [AutoMap(typeof(ServiceOffer))]
    public class ServiceOfferDto : FullAuditedEntityDto<Guid>
    {
        public Guid ReferenceId { get; set; }
        public Guid ServiceId { get; set; }
        public ServiceOfferStatus Status { get; set; } = ServiceOfferStatus.Queued;
        public double? PercentageDiscount { get; set; }
        public decimal? DiscountAmount { get; set; }
        public bool IsOfferDurationLimited { get; set; } = false;
        public int? OfferLimitDays { get; set; }
        public int? OfferLimitHours { get; set; }
        public int? OfferLimitMinutes { get; set; }
        public bool IsNumberOfUnitsLimited { get; set; } = false;
        public int? UnitLimit { get; set; }

        [NotMapped]
        public AvailableServiceDto Service { get; set; }
    }
}
