using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Events.Dto
{
    public  class PagedEventResultRequestDto : PagedResultRequestDto
    {
        public Guid? ParentIdFilter { get; set; }
        public long? UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public EventStatus? StausFilter { get; set; }
    }
}
