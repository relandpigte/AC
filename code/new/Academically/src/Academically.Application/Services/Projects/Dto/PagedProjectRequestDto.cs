using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Projects.Dto
{
    public class PagedProjectRequestDto : PagedResultRequestDto
    {
        public long UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
    }
}