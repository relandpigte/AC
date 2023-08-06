using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.UserAvailabilities.Dto
{
    [AutoMap(typeof(UserAvailability))]
    public class UserAvailabilityDto : EntityDto<Guid?>
    {
        public DayOfWeek? DayOfWeek { get; set; }
        public bool IsAvailable { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public DateTime? SpecificDate { get; set; }

    }
}
