using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Academically.Services.UserQualifications.Dto
{
    [AutoMapFrom(typeof(UserQualification))]
    public class UserQualificationDto : EntityDto<Guid>
    {
        public string ProfessionalCertificateOrAward { get; set; }
        public string ConferringOrganization { get; set; }
        public string Summary { get; set; }
        public string StartYear { get; set; }
        public string GradeAttained { get; set; }

        public List<UserQualificationDocumentDto> UserQualificationDocuments { get; set; }
    }
}
