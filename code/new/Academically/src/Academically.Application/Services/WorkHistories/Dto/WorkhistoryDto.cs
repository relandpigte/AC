using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.WorkHistories.Dto
{
    [AutoMap(typeof(WorkHistory))]
    public class WorkHistoryDto : EntityDto<Guid>
    {
        public string JobTitle { get; set; }
        public string Company { get; set; }
        public int StartYear { get; set; }
        public int EndYear { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Summary { get; set; }
    }
}