using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.AcceptanceLogs.Dto
{
    [AutoMap(typeof(AcceptanceLog))]
    public class AcceptanceLogDto : EntityDto<Guid>
    {
        public AcceptanceType Type { get; set; }
    }
}
