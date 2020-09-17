using Abp.Domain.Entities;
using Academically.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyUserPublications")]
    public class UserPublication : Entity<Guid>
    {
        public string PublicationCertificate { get; set; }
        public string Publisher { get; set; }
        public string Summary { get; set; }
        public long UserId { get; set; }

    }
}
