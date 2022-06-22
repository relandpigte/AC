using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Coachings.Dto
{
    public class UpdateCoachingPresenterTypeDto : EntityDto<Guid>
	{
        public CoachingPresenterType NewType { get; set; }
    }
}

