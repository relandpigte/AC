using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.CoachingResources.Dto
{
    [AutoMapTo(typeof(CoachingResource))]
    public class CreateCoachingResourceDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public CoachingResourceType Type { get; set; }
        public Guid CoachingId { get; set; }
    }
}