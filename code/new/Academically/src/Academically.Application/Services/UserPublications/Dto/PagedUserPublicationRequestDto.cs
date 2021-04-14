using Abp.Application.Services.Dto;
using System;

namespace Academically.Services.UserPublications.Dto
{
    public class PagedUserPublicationRequestDto : PagedResultRequestDto
    {
        public long UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
    }
}
