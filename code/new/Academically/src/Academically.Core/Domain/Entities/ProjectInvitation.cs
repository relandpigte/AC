using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Domain.Entities
{
    [Table("ProjectInvitations")]
    public class ProjectInvitation : CreationAuditedEntity<Guid>
    {
        public Guid ProjectId { get; set; }
        public long TutorId { get; set; }

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }

        [ForeignKey("TutorId")]
        public virtual User Tutor { get; set; }
    }
}
