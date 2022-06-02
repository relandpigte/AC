using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;
using System;

namespace Academically.Services.Projects.Dto
{
    [AutoMap(typeof(ProjectAvailability))]
    public class ProjectAvailabilityDto : EntityDto<Guid>
    {
        public Guid ProjectId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public ProjectDto Project { get; set; }
    }
}
