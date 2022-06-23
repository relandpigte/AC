using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Workshops.Dto
{
    public class PagedWorkshopPresentersForInviteResultRequestDto : PagedResultRequestDto
	{
        public Guid WorkshopIdFilter { get; set; }
        public string SearchFilter { get; set; }
    }
}

