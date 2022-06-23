using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.WorkshopPolls.Dto
{
    public class PagedWorkshopPollResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid WorkshopIdFilter { get; set; }
    }
}

