using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Explore.Dto
{
    public class PagedPopularRequestDto: PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
    }
}
