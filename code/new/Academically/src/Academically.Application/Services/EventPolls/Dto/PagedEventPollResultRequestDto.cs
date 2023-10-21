using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.EventPolls.Dto
{
    public class PagedEventPollResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid? EventIdFilter { get; set; }
        public EventPollStatus? Status { get; set; }
    }
}

