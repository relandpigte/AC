using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;

namespace Academically.Services.Workshops.Dto
{
	[AutoMapFrom(typeof(WorkshopPresenter))]
	public class WorkshopPresenterDto : EntityDto<Guid>
    {
        public WorkshopPresenterType Type { get; set; }
        public WorkshopPresenterStatus Status { get; set; }
        public Guid WorkshopId { get; set; }
        public long? UserId { get; set; }
        public string Email { get; set; }
        public long CreatorUserId { get; set; }

        public UserDto User { get; set; }
    }
}

