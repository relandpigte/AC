using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Events.Dto
{
    public class UpdateEventPresenterStatusDto : EntityDto<Guid>
    {
        public EventPresenterStatus Status { get; set; }
    }
}
