using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyStudentVideos")]
    public class StudentVideo : CreationAuditedEntity<Guid>
    {
        public Guid VideoId { get; set; }

        [ForeignKey("VideoId")]
        public virtual Video Video { get; set; }
        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}

