using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ProjectDocuments")]
    public class ProjectDocument : Entity<Guid>
    {
        public Guid ProjectId { get; set; }
        public Guid DocumentId { get; set; }

        public virtual Project Project { get; set; }
        public virtual Document Document { get; set; }
    }
}
