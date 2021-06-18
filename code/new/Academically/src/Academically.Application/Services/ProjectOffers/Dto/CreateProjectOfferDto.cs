using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.ProjectOffers.Dto
{
    [AutoMapTo(typeof(ProjectOffer))]
    public class CreateProjectOfferDto
    {
        public Guid ProjectId { get; set; }
        public bool IsHourlySessionOffered { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsDiscountedHourlySessionOffered { get; set; }
        public double DiscountedHours { get; set; }
        public decimal DiscountedHourlyRate { get; set; }
        public bool IsFreeSessionOffered { get; set; }
    }
}
