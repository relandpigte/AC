using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcceptanceLogs")]
    public class AcceptanceLog : CreationAuditedEntity<Guid>
    {
        public AcceptanceType Type { get; set; }
        public string IpAddress { get; set; }
    }
}
