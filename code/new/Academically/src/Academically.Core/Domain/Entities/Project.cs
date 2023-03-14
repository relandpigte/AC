using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("Projects")]
    public class Project : FullAuditedEntity<Guid>
    {
        public Project()
        {
            Offers = new HashSet<ProjectOffer>();
            CalendarEvents = new HashSet<CalendarEvent>();
            ProjectDocuments = new HashSet<ProjectDocument>();
            ProjectAvailabilities = new HashSet<ProjectAvailability>();
        }

        public string Name { get; set; }
        public string Description { get; set; }
        public string AcademicLevel { get; set; }
        public string Qualification { get; set; }
        public string Methodology { get; set; }
        public string SubjectArea { get; set; }
        public string SubjectKeyWords { get; set; }
        public string UrgencyLevel { get; set; }
        public DateTime? Deadline { get; set; }
        public bool? IsPrivateRequest { get; set; }
        public bool? HasFiles { get; set; }

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
        public virtual ICollection<ProjectDocument> ProjectDocuments { get; set; }
        public virtual ICollection<ProjectAvailability> ProjectAvailabilities { get; set; }
    }
}
