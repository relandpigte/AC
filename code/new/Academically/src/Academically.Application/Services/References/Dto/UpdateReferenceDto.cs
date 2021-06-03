using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;

namespace Academically.Services.References.Dto
{
    [AutoMapTo(typeof(Reference))]
    public class UpdateReferenceDto : EntityDto<Guid>
    {
        public string Forename { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public ReferenceRelationshipType Relationship { get; set; }

        public IFormFile File { get; set; }
    }
}
