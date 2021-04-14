using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserPublicationTags")]
    public class UserPublicationTag : Entity<Guid>
    {
        public Guid UserPublicationId { get; set; }
        public Guid PublicationTagId { get; set; }

        [ForeignKey("UserPublicationId")]
        public virtual UserPublication UserPublication { get; set; }
        [ForeignKey("PublicationTagId")]
        public virtual PublicationTag PublicationTag { get; set; }
    }
}
