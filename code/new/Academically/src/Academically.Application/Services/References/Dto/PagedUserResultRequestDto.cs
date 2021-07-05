using Abp.Application.Services.Dto;

namespace Academically.Users.Dto
{
    public class PagedReferenceResultRequestDto : PagedAndSortedResultRequestDto
    {
        public long UserIdFilter { get; set; }
    }
}
