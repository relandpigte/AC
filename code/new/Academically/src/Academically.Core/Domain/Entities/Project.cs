using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyProjects")]
    public class Project : FullAuditedEntity<Guid>
    {
        public Project()
        {
            Offers = new HashSet<ProjectOffer>();
            CalendarEvents = new HashSet<CalendarEvent>();
        }

        public string Name { get; set; }
        public Guid? ServiceLevel1 { get; set; }
        public string ServiceNameLevel1 { get; set; }

        public Guid? ServiceLevel2 { get; set; }
        public string ServiceNameLevel2 { get; set; }

        public Guid? ServiceLevel3 { get; set; }
        public string ServiceNameLevel3 { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<ProjectOffer> Offers { get; set; }
        public virtual ICollection<CalendarEvent> CalendarEvents { get; set; }
    }
}
