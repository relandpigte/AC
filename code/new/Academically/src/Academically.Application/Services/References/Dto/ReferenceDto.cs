using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Documents.Dto;
using Microsoft.AspNetCore.Http;
using System;

namespace Academically.Services.References.Dto
{
    [AutoMapFrom(typeof(Reference))]
    public class ReferenceDto : EntityDto<Guid>
    {
        public string Forename { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public ReferenceRelationshipType Relationship { get; set; }
        public Guid DocumentId { get; set; }

        public DocumentDto Document { get; set; }

        public string ReferenceFileUrl { get; set; }
        public IFormFile File { get; set; }
    }
}
