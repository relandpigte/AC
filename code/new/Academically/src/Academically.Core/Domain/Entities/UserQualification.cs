using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("UserQualifications")]
    public class UserQualification : CreationAuditedEntity<Guid>
    {
        public UserQualification()
        {
            UserQualificationDocuments = new HashSet<UserQualificationDocument>();
        }

        public string ProfessionalCertificateOrAward { get; set; }
        public string ConferringOrganization { get; set; }
        public string Summary { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string StartYear { get; set; }
        public string EndYear { get; set; }
        public string GradeAttained { get; set; }

        public virtual ICollection<UserQualificationDocument> UserQualificationDocuments { get; set; }
    }
}
