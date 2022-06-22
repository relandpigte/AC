using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Coachings.Dto
{
    public class PagedCoachingPresentersForInviteResultRequestDto : PagedResultRequestDto
	{
        public Guid CoachingIdFilter { get; set; }
        public string SearchFilter { get; set; }
    }
}

