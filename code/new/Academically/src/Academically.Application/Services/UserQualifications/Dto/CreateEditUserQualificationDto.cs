using Abp.AutoMapper;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace Academically.Services.UserQualifications.Dto
{
    [AutoMapTo(typeof(UserQualification))]
    public class CreateEditUserQualificationDto
    {
        public string ProfessionalCertificateOrAward { get; set; }
        public string ConferringOrganization { get; set; }
        public string Summary { get; set; }
        public string StartYear { get; set; }
        public string GradeAttained { get; set; }

        public List<IFormFile> DocumentsToUpload { get; set; }
    }
}
