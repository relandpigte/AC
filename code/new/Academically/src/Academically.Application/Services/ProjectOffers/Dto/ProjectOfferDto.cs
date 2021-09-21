using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Projects.Dto;
using Academically.Users.Dto;

namespace Academically.Services.ProjectOffers.Dto
{
    [AutoMap(typeof(ProjectOffer))]
    public class ProjectOfferDto : EntityDto<Guid>
    {
        public Guid ProjectId { get; set; }
        public bool IsHourlySessionOffered { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsDiscountedHourlySessionOffered { get; set; }
        public double DiscountedHours { get; set; }
        public decimal DiscountedHourlyRate { get; set; }
        public bool IsFreeSessionOffered { get; set; }
        public bool IsAccepted { get; set; }

        public DateTime CreationTime { get; set; }
        public long CreatorUserId { get; set; }

        public ProjectDto Project { get; set; }
        public UserDto CreatorUser { get; set; }
    }
}
