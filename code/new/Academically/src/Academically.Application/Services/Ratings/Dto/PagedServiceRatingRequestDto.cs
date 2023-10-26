using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Ratings.Dto;

public class PagedServiceRatingRequestDto : PagedResultRequestDto
{
    public Guid ServiceId { get; set; }
}