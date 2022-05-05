using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Events.Dto
{
	[AutoMapTo(typeof(EventPresenter))]
	public class CreateEventPresenterDto
	{
        public EventPresenterType Type { get; set; }
        public Guid EventId { get; set; }
        public string Email { get; set; }
    }
}

