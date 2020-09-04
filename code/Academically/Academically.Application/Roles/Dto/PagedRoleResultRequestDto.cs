using Abp.Application.Services.Dto;

namespace Academically.Roles.Dto
{
    public class PagedRoleResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}

