using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Coachings.Dto
{
    [AutoMapTo(typeof(Coaching))]
    public class CreateCoachingDto
    {
        public string Name { get; set; }
        public CoachingType Type { get; set; }
    }
}
