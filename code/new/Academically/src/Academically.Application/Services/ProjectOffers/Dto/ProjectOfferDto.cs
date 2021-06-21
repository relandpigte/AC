using Abp.AutoMapper;
using Abp.Domain.Entities;
using Academically.Domain.Entities;
using Academically.Services.Projects.Dto;
using System;

namespace Academically.Services.ProjectOffers.Dto
{
    [AutoMap(typeof(ProjectOffer))]
    public class ProjectOfferDto : Entity<Guid>
    {
        public Guid ProjectId { get; set; }
        public bool IsHourlySessionOffered { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsDiscountedHourlySessionOffered { get; set; }
        public double DiscountedHours { get; set; }
        public decimal DiscountedHourlyRate { get; set; }
        public bool IsFreeSessionOffered { get; set; }

        public ProjectDto Project { get; set; }
    }
}
