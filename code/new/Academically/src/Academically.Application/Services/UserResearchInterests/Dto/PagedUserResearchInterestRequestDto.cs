using Abp.Application.Services.Dto;

namespace Academically.Services.UserResearchInterests.Dto
{
    public class PagedUserResearchInterestRequestDto : PagedResultRequestDto
    {
        public long UserIdFilter { get; set; }
    }
}
