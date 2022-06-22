using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Coachings.Dto
{
    public  class PagedCoachingResultRequestDto : PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public CoachingStatus? StatusFilter { get; set; }
    }
}
