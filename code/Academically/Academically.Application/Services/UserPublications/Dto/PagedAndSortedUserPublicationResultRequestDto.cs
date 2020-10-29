using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.UserPublications.Dto
{
    public class PagedAndSortedUserPublicationResultRequestDto : PagedAndSortedResultRequestDto
    {
        public long UserId { get; set; }
    }
}
