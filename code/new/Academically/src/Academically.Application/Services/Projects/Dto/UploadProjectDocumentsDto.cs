using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Projects.Dto
{
    public class UploadProjectDocumentsDto
    {
        public Guid ProjectId { get; set; }
        public IEnumerable<IFormFile> Documents { get; set; }
    }
}
