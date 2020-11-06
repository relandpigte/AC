using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Entities
{
    [Table("AcademicallySupportServiceRequests")]
    public class SupportServiceRequest : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Comments { get; set; }
        public Guid ParentId { get; set; }

        public virtual SupportService Parent { get; set; }
    }
}
