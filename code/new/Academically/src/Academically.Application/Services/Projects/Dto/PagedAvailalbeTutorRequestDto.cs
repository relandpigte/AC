using Abp.Application.Services.Dto;

namespace Academically.Services.Projects.Dto
{
    public class PagedAvailalbeTutorRequestDto : PagedResultRequestDto
    {
        public string SearchFilter { get; set; }
    }
}
