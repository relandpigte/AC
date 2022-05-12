using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Events.Dto
{
    public class PagedEventInstanceResultRequestDto : PagedResultRequestDto
	{
        public Guid EventIdFilter { get; set; }
        public bool PastFilter { get; set; }
    }
}

