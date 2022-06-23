using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Workshops.Dto
{
    public  class PagedWorkshopResultRequestDto : PagedResultRequestDto
    {
        public Guid? ParentIdFilter { get; set; }
        public long? UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public WorkshopStatus? StatusFilter { get; set; }
    }
}
