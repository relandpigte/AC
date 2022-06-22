using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.CoachingPolls.Dto
{
    public class PagedCoachingPollResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid CoachingIdFilter { get; set; }
    }
}

