using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities
{
    [Table("DisciplineTaxonomies")]
    public class DisciplineTaxonomy : CreationAuditedEntity<Guid>
    {
        public DisciplineTaxonomy()
        {
            Children = new HashSet<DisciplineTaxonomy>();
            UserTopics = new HashSet<UserTopic>();
        }

        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }
        public bool IsEditable { get; set; }

        public virtual DisciplineTaxonomy Parent { get; set; }
        public virtual ICollection<DisciplineTaxonomy> Children { get; set; }
        public virtual ICollection<UserTopic> UserTopics { get; set; }
    }
}
