using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Entities
{
    [Table("AcademicallyResearchMethodRequests")]
    public class ResearchMethodRequest : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Comments { get; set; }
        public Guid ParentId { get; set; }

        public virtual ResearchMethod Parent { get; set; }
    }
}
