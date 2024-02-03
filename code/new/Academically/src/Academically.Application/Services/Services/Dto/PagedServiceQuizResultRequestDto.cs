using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
    public class PagedServiceQuizResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid ReferenceIdFilter { get; set; }
        public ServicesType? ServiceTypeFilter { get; set; }
    }
}

