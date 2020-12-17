using Abp.Domain.Entities;
using Academically.Entities.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyGuardianConsentProfiles")]
    public class GuardianConsentProfile : Entity<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string IPAddress { get; set; }
        public Guid ReferenceId { get; set; }
        public SourceType? SourceType { get; set; }
        public  DateTime? ConsentedDate { get; set; }
    }
}
