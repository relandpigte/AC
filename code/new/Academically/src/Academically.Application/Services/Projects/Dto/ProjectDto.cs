using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.CalendarEvents.Dto;
using Academically.Services.ProjectOffers.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Projects.Dto
{
    [AutoMap(typeof(Project))]
    public class ProjectDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid? ServiceLevel1 { get; set; }
        public string ServiceNameLevel1 { get; set; }

        public Guid? ServiceLevel2 { get; set; }
        public string ServiceNameLevel2 { get; set; }

        public Guid? ServiceLevel3 { get; set; }
        public string ServiceNameLevel3 { get; set; }

        public UserDto CreatorUser { get; set; }

        public bool CanSubmitOffer { get; set; } = true;

        public int TotalSessions { get; set; }

        public ProjectOfferDto AcceptedOffer { get; set; }

        public DateTime CreationTime { get; set; }
        public long CreatorUserId { get; set; }

        public IEnumerable<ProjectOfferDto> Offers { get; set; }
        public IEnumerable<CalendarEventDto> CalendarEvents { get; set; }
    }
}
