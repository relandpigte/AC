using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyDisciplineTaxonomyRequests")]
    public class DisciplineTaxonomyRequest : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Notes { get; set; }
        public Guid ParentId { get; set; }
        public virtual DisciplineTaxonomy Parent { get; set; }
    }
}
