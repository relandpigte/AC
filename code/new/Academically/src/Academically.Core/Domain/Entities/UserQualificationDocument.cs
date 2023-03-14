using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("UserQualificationDocuments")]
    public class UserQualificationDocument : Entity<Guid>
    {
        public Guid UserQualificationId { get; set; }
        public Guid DocumentId { get; set; }
        public bool IsReviewed { get; set; }

        public virtual Document Document { get; set; }
    }
}
