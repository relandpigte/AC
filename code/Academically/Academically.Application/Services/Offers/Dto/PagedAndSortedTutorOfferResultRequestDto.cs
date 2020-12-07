using System;
using Abp.Application.Services.Dto;
using Academically.Entities.Enums;

namespace Academically.Services.Offers.Dto
{
    public class PagedAndSortedTutorOfferResultRequestDto : PagedAndSortedResultRequestDto
    {
        public Guid TutorialIdFilter { get; set; }
        public EducationLevel? EducationLevelFilter { get; set; }
        public int? DistanceFilter { get; set; }
    }
}
