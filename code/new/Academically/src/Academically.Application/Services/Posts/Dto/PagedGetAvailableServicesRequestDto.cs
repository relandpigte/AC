using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Posts.Dto
{
    public class PagedGetScheduledServicesRequestDto : PagedResultRequestDto
    {
        public long? CreatorUserId { get; set; }
        public ScheduledServiceType? ScheduleType { get; set; }
    }
}
