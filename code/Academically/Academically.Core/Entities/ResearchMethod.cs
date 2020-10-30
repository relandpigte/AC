using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Entities
{
    [Table("AcademicallyResearchMethodologies")]
    public class ResearchMethod : Entity<Guid>
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }
        public bool IsEditable { get; set; }

        public virtual ResearchMethod Parent { get; set; }
        public virtual ICollection<ResearchMethod> Children { get; set; }
    }
}
