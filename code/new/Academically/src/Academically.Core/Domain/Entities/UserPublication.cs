using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserPublications")]
    public class UserPublication : CreationAuditedEntity<Guid>
    {
        public UserPublication()
        {
            UserPublicationTags = new HashSet<UserPublicationTag>();
        }

        public string Title { get; set; }
        public PublicationType PublicationType { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Abstract { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<UserPublicationTag> UserPublicationTags { get; set; }
    }
}
