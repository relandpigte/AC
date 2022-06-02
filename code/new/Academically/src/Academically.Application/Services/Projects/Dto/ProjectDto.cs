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
        public string Description { get; set; }
        public string AcademicLevel { get; set; }
        public string Qualification { get; set; }
        public string Methodology { get; set; }
        public string SubjectArea { get; set; }
        public string SubjectKeyWords { get; set; }
        public string UrgencyLevel { get; set; }
        public DateTime Deadline { get; set; }
        public bool IsPrivateRequest { get; set; }

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
        public IEnumerable<ProjectDocumentDto> ProjectDocuments { get; set; }
        public IEnumerable<ProjectAvailabilityDto> ProjectAvailabilities { get; set; }

    }
}
