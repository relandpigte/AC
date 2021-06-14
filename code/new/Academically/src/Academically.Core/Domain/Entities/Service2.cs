using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyServices2")]
    public class Service2 : Entity<Guid>
    {
        public Service2()
        {
            Children = new HashSet<Service2>();
        }

        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentIdMap { get; set; }
        public bool IsEditable { get; set; }

        public virtual Service2 Parent { get; set; }
        public virtual ICollection<Service2> Children { get; set; }
    }
}
