using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;

namespace Academically.Services.Events.Dto
{
	[AutoMapFrom(typeof(EventPresenter))]
	public class EventPresenterDto : EntityDto<Guid>
    {
        public EventPresenterType Type { get; set; }
        public Guid EventId { get; set; }
        public long UserId { get; set; }

        public UserDto User { get; set; }
    }
}

