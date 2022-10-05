using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Explore.Dto
{
    public class PagedExploreGroupByTopicResultRequestDto : PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public string Topic { get; set; }
    }
}
