using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserEducationDocuments")]
    public class UserEducationDocument : EntityDto<Guid>
    {
        public Guid UserEducationId { get; set; }
        public Guid DocumentId { get; set; }
        public string Category { get; set; }
        public bool IsReviewed { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }
    }
}
