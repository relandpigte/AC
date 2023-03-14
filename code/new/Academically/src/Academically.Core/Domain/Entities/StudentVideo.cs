using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("StudentVideos")]
    public class StudentVideo : CreationAuditedEntity<Guid>
    {
        public Guid VideoId { get; set; }
        public bool SaveOnly { get; set; }

        [ForeignKey("VideoId")]
        public virtual Video Video { get; set; }
        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}

