using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyReferences")]
    public class Reference : CreationAuditedEntity<Guid>
    {
        public string Forename { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public ReferenceRelationshipType Relationship { get; set; }
        public Guid DocumentId { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }
    }
}
