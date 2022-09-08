using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.EventOffers.Dto
{
    public class PagedEventOfferResultRequestDto : PagedAndSortedResultRequestDto
	{
        public Guid EventIdFilter { get; set; }
    }
}

