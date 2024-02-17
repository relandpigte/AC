using Microsoft.AspNetCore.Http;
using System;

namespace Academically.Services.Documents.Dto
{
    public class CreateDocumentDto
    {
        public DocumentDto Document { get; set; }
        public Guid? ReferenceId { get; set; }
        public IFormFile? File { get; set; }
    }
}
