using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.CoachingResources.Dto
{
    public class PagedCoachingResourceResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid CoachingIdFilter { get; set; }
        public bool PresentationMaterialsOnlyFilter { get; set; }
        public bool HandoutsOnlyFilter { get; set; }
    }
}

