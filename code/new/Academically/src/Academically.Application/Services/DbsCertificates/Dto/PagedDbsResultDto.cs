using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.DbsCertificates.Dto
{
    public class PagedDbsResultDto: PagedAndSortedResultRequestDto
    {
        public long UserIdFilter { get; set; }
    }
}
