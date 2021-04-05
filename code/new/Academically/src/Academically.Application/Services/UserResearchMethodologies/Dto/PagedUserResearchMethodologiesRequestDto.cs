using Abp.Application.Services.Dto;

namespace Academically.Services.UserResearchMethodologies.Dto
{
    public class PagedUserResearchMethodologiesRequestDto : PagedResultRequestDto
    {
        public long UserIdFilter { get; set; }
    }
}
