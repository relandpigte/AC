using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Explore.Dto
{
    public class PagedExploreGroupByTopicResultRequestDto : PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public string Topic { get; set; }
        public EventCategory? CategoryFilter { get; set; }
    }
}
