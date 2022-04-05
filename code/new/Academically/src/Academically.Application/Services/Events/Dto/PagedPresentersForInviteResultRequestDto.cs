using Abp.Application.Services.Dto;

namespace Academically.Services.Events.Dto
{
    public class PagedPresentersForInviteResultRequestDto : PagedResultRequestDto
	{
        public string SearchFilter { get; set; }
    }
}

