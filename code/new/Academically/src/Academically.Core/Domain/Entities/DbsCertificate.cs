using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("DbsCertificates")]
    public class DbsCertificate : CreationAuditedEntity<Guid>
    {
        public string DbsNumber { get; set; }
        public DateTime DateOfIssue { get; set; }
        public Guid DocumentId { get; set; }

        public virtual Document Document { get; set; }
    }
}
