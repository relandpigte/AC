using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.EventPolls.Dto
{
    public class PagedEventPollResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid EventIdFilter { get; set; }
    }
}

