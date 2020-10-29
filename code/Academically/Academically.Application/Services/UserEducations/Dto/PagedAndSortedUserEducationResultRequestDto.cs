using Abp.Application.Services.Dto;

namespace Academically.Services.UserEducations.Dto
{
    public class PagedAndSortedUserEducationResultRequestDto : PagedAndSortedResultRequestDto
    {
        public long UserId { get; set; }
    }
}
