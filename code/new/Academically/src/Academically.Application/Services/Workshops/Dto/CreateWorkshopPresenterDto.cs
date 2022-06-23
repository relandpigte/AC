using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Workshops.Dto
{
	[AutoMapTo(typeof(WorkshopPresenter))]
	public class CreateWorkshopPresenterDto
	{
        public WorkshopPresenterType Type { get; set; }
        public Guid WorkshopId { get; set; }
        public string Email { get; set; }
    }
}

