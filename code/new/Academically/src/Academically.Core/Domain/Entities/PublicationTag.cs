using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyPublicationTags")]
    public class PublicationTag : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
    }
}
