using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Videos.Dto
{
	public class PagedVideoResultRequestDto : PagedResultRequestDto
	{
        public long? UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public VideoStatus? StausFilter { get; set; }
    }
}

