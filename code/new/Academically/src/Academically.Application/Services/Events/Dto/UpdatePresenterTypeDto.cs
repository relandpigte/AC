using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Events.Dto
{
    public class UpdatePresenterTypeDto : EntityDto<Guid>
	{
        public EventPresenterType NewType { get; set; }
    }
}

