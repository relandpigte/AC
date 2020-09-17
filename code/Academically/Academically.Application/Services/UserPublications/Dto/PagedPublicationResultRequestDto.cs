using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserPublications.Dto
{
    public class PagedPublicationResultRequestDto : PagedAndSortedResultRequestDto
    {
        public long UserId { get; set; }
        public string Keyword { get; set; }
    }
}
