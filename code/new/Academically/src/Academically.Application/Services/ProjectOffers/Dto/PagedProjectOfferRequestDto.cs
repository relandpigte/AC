using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Projects.Dto
{
    public class PagedProjectOfferRequestDto : PagedResultRequestDto
    {
        public long UserIdFilter { get; set; }
        public Guid? ProjectIdFilter { get; set; } 
        public string SearchFilter { get; set; }
    }
}