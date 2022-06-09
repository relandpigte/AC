using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyWorkHistories")]
    public class WorkHistory : CreationAuditedEntity<Guid>
    {
        public string JobTitle { get; set; }

        public string Company { get; set; }

        public int StartYear { get; set; }

        public int EndYear { get; set; }

        public string Country { get; set; }

        public string City { get; set; }

        public string Summary { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}
