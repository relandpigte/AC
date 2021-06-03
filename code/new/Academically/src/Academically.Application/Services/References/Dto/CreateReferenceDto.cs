using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.References.Dto
{
    [AutoMapTo(typeof(Reference))]
    public class CreateReferenceDto
    {
        public string Forename { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public ReferenceRelationshipType Relationship { get; set; }

        public IFormFile File { get; set; }
    }
}
