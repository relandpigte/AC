using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.WorkshopResources.Dto
{
    public class PagedWorkshopResourceResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid WorkshopIdFilter { get; set; }
        public bool PresentationMaterialsOnlyFilter { get; set; }
        public bool HandoutsOnlyFilter { get; set; }
    }
}

