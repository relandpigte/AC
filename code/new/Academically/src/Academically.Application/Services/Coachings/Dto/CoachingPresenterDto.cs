using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;

namespace Academically.Services.Coachings.Dto
{
	[AutoMapFrom(typeof(CoachingPresenter))]
	public class CoachingPresenterDto : EntityDto<Guid>
    {
        public CoachingPresenterType Type { get; set; }
        public CoachingPresenterStatus Status { get; set; }
        public Guid CoachingId { get; set; }
        public long? UserId { get; set; }
        public string Email { get; set; }
        public long CreatorUserId { get; set; }

        public UserDto User { get; set; }
    }
}

