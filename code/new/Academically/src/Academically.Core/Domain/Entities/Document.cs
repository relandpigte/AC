using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyDocuments")]
    public class Document : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string OriginalFileName { get; set; }
        public string FileType { get; set; }
        public DocumentType DocumentType { get; set; }
    }
}
