using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Workshops.Dto
{
    public class UpdateWorkshopPresenterTypeDto : EntityDto<Guid>
	{
        public WorkshopPresenterType NewType { get; set; }
    }
}

