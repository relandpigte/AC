using Abp.Application.Services.Dto;
using System;

namespace Academically.Services.Posts.Dto
{
    public class PagedGetAvailableServicesRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public int? Take { get; set; }
        public long? CreatorUserId { get; set; }
    }
}
