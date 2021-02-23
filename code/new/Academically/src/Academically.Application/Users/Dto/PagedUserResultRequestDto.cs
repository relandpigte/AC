using Abp.Application.Services.Dto;

namespace Academically.Users.Dto
{
    public class PagedUserResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public bool? IsActive { get; set; }
    }
}
