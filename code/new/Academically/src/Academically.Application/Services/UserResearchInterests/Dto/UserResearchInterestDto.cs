using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.UserResearchInterests.Dto
{
    [AutoMap(typeof(UserResearchInterest))]
    public class UserResearchInterestDto : EntityDto<Guid?>
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public IEnumerable<UserResearchInterestDisciplineTaxonomyDto> UserResearchInterestDisciplineTaxonomies { get; set; }
    }
}
