using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.UserEducations.Dto
{
    public class UploadUserEducationDocumentsDto
    {
        public Guid UserEducationId { get; set; }
        public string Categories { get; set; }
        public IEnumerable<IFormFile> Documents { get; set; }
    }
}
