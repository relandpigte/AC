using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.DisciplineTaxonomies.Dto;
using Academically.Services.Services.Dto;
using AutoMapper.Configuration.Annotations;
using System;
using System.Collections.Generic;

namespace Academically.Services.UserServices.Dto
{
    [AutoMap(typeof(UserService))]
    public class UserServiceDto : EntityDto<Guid>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public ServiceExpertiseLevel ExpertiseLevel { get; set; }
        public Guid ServiceMappingId { get; set; }
        public ServiceMappingDto ServiceMapping { get; set; }

        [Ignore]
        public IEnumerable<SubjectDto> Subjects { get; set; }
        [Ignore]
        public IEnumerable<ServiceDisciplineTaxonomyDto> DisciplineTaxonomies { get; set; }
    }
}
