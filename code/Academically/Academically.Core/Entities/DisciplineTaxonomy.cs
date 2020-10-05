using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Entities
{
    [Table("AcademicallyDisciplineTaxonomies")]
    public class DisciplineTaxonomy : Entity<Guid>
    {
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }

        public virtual DisciplineTaxonomy Parent { get; set; }
        public virtual ICollection<DisciplineTaxonomy> Children { get; set; }
    }
}
