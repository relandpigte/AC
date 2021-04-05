using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Academically.Services.UserResearchMethodologies.Dto
{
    [AutoMap(typeof(UserResearchMethodology))]
    public class UserResearchMethodologyDto : EntityDto<Guid?>
    {

        public string Title { get; set; }
        public string Description { get; set; }

        public IEnumerable<UserResearchMethodologyResearchMethodDto> UserResearchMethodologyResearchMethods { get; set; }
    }
}
