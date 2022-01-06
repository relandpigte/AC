using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Videos.Dto
{
	public class PagedSeriesVideoResultRequestDto : PagedResultRequestDto
	{
        public Guid ParentIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public VideoStatus? StausFilter { get; set; }
    }
}

