using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Currencies.Dto
{
    [AutoMap(typeof(Currency))]
    public class CurrencyDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsEnabled { get; set; }
    }
}
