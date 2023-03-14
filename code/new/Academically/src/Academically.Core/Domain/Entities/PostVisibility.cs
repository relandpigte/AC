using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("PostVisibility")]
    public class PostVisibility : CreationAuditedEntity<Guid>
    {
        public Guid PostId { get; set; }
        public bool IsHidden { get; set; }

        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User User { get; set; }
    }
}
