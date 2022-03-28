using Abp.Application.Services.Dto;

namespace Academically.Services.Events.Dto
{
    public class PagedStudentEventResultRequestDto : PagedResultRequestDto
    {
        public bool SaveOnlyFilter { get; set; }
    }
}

