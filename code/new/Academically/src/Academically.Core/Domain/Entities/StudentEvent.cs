using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("StudentEvents")]
    public class StudentEvent : CreationAuditedEntity<Guid>
    {
        public Guid EventId { get; set; }
        public bool SaveOnly { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }
    }
}

