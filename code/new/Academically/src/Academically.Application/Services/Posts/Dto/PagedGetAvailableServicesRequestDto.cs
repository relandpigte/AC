using Abp.Application.Services.Dto;

namespace Academically.Services.Posts.Dto
{
    public class PagedGetAvailableServicesRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public int? Take { get; set; }
    }
}
