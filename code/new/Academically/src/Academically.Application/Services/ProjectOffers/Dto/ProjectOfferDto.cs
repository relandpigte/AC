using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Services.Projects.Dto;
using Academically.Users.Dto;

namespace Academically.Services.ProjectOffers.Dto
{
    [AutoMap(typeof(ProjectOffer))]
    public class ProjectOfferDto : CreationAuditedEntity<Guid>
    {
        public Guid ProjectId { get; set; }
        public bool IsHourlySessionOffered { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsDiscountedHourlySessionOffered { get; set; }
        public double DiscountedHours { get; set; }
        public decimal DiscountedHourlyRate { get; set; }
        public bool IsFreeSessionOffered { get; set; }
        public bool IsAccepted { get; set; }

        public ProjectDto Project { get; set; }
        public UserDto CreatorUser { get; set; }
    }
}
