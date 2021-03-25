using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMap(typeof(UserEducationDocument))]
    public class UserEducationDocumentDto : EntityDto<Guid?>
    {
        public Guid UserEductionId { get; set; }
        public Guid DocumentId { get; set; }
        public string Category { get; set; }
        public bool IsReviewed { get; set; }

        public DocumentDto Document { get; set; }
    }
}
