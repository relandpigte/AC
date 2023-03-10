using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Events.Enums;

namespace Academically.Services.Events.Dto
{
    public class PagedEventScheduleResultRequestDto : PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public EventScheduleFilter? EventScheduleFilter { get; set; }
        public EventCategory? CategoryFilter { get; set; }
    }
}
