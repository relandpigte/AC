using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Explore.Dto
{
    public class PagedExploreGroupByDateResultRequestDto : PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? MovingDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateGrains? Grain { get; set; }
    }
}
