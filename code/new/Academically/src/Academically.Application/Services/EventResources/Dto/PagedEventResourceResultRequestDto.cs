using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.EventResources.Dto
{
    public class PagedEventResourceResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid EventIdFilter { get; set; }
        public bool PresentationMaterialsOnlyFilter { get; set; }
        public bool HandoutsOnlyFilter { get; set; }
    }
}

