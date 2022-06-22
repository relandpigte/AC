using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Coachings.Dto
{
	[AutoMapTo(typeof(CoachingPresenter))]
	public class CreateCoachingPresenterDto
	{
        public CoachingPresenterType Type { get; set; }
        public Guid CoachingId { get; set; }
        public string Email { get; set; }
    }
}

