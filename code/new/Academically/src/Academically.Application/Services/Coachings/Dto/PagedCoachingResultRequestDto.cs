using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Coachings.Dto
{
    public  class PagedCoachingResultRequestDto : PagedResultRequestDto
    {
        public Guid? ParentIdFilter { get; set; }
        public long? UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public CoachingStatus? StatusFilter { get; set; }
    }
}
