using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("Subjects")]
    public class Subject : CreationAuditedEntity<Guid>
    {
        public Subject()
        {
            ServiceSubjects = new HashSet<ServiceSubject>();
        }

        public string Name { get; set; }
        public DateTime? ReviewTime { get; set; }
        public long? ReviewerUserId { get; set; }
        public SubjectReviewStatus ReviewStatus { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<ServiceSubject> ServiceSubjects { get; set; }
    }
}
