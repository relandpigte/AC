using Abp.Application.Services.Dto;

namespace Academically.Services.Topics.Dto
{
    public class PagedTopicResultRequestDto : PagedResultRequestDto
	{
        public string SearchFilter { get; set; }
    }
}

