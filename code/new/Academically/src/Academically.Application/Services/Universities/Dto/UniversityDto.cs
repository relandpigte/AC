using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.UserEducations.Dto;

namespace Academically.Services.Universities.Dto
{
    [AutoMap(typeof(University))]
    public class UniversityDto : EntityDto<Guid>
    {
        public string HeProvider { get; set; }
        public string CountryCode { get; set; }

        public IEnumerable<UserEducationDto> UserEducations { get; set; }
    }
}
