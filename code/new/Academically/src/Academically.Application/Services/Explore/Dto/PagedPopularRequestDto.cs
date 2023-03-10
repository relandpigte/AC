using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Explore.Dto
{
    public class PagedPopularRequestDto: PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public EventCategory? CategoryFilter { get; set; }
    }
}
