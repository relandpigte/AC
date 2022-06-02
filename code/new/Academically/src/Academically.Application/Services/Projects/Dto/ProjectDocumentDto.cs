using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;
using System;

namespace Academically.Services.Projects.Dto
{
    [AutoMap(typeof(ProjectDocument))]
    public class ProjectDocumentDto : EntityDto<Guid>
    {
        public Guid ProjectId { get; set; }
        public Guid DocumentId { get; set; }
        public string DocumentUrl { get; set; }

        public ProjectDto Project { get; set; }
        public DocumentDto Document { get; set; }
    }
}
