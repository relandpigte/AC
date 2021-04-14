using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMap(typeof(UserEducation))]
    public class UserEducationDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public string City { get; set; }
        public string StartYear { get; set; }
        public string EndYear { get; set; }

        public string UniversityName { get; set; }
        public string UniversityCountryCode { get; set; }

        public IEnumerable<UserEducationLevelDto> UserEducationLevels { get; set; }
        public IEnumerable<UserEducationDocumentDto> UserEducationDocuments { get; set; }
    }
}
