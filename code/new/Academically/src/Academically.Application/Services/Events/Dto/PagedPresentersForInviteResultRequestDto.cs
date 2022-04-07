using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Events.Dto
{
    public class PagedPresentersForInviteResultRequestDto : PagedResultRequestDto
	{
        public Guid EventIdFilter { get; set; }
        public string SearchFilter { get; set; }
    }
}

