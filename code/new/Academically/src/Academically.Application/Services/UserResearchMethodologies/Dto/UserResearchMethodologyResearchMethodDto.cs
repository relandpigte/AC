using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.ResearchMethods.Dto;
using System;

namespace Academically.Services.UserResearchMethodologies.Dto
{
    [AutoMap(typeof(UserResearchMethodologyResearchMethod))]
    public class UserResearchMethodologyResearchMethodDto : EntityDto<Guid?>
    {
        public Guid UserResearchMethodologyId { get; set; }
        public Guid ResearchMethodId { get; set; }

        public ResearchMethodDto ResearchMethod { get; set; }
    }
}
