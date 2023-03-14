using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("UserEducationDocuments")]
    public class UserEducationDocument : Entity<Guid>
    {
        public Guid UserEducationId { get; set; }
        public Guid DocumentId { get; set; }
        public string Category { get; set; }
        public bool IsReviewed { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }
    }
}
