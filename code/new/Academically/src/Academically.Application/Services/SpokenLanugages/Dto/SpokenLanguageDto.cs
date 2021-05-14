using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.SpokenLanugages.Dto
{
    [AutoMap(typeof(SpokenLanguage))]
    public class SpokenLanguageDto: EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
