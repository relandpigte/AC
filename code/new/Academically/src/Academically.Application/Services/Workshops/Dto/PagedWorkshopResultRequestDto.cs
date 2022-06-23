using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Workshops.Dto
{
    public  class PagedWorkshopResultRequestDto : PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public WorkshopStatus? StatusFilter { get; set; }
    }
}
