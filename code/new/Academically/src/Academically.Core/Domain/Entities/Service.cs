using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyServices")]
    public class Service : Entity<Guid>
    {
        public Service()
        {
            ServiceMappings = new HashSet<ServiceMapping>();
            ServiceSubjects = new HashSet<ServiceSubject>();
        }

        public string Name { get; set; }

        public virtual ICollection<ServiceMapping> ServiceMappings { get; set; }
        public virtual ICollection<ServiceSubject> ServiceSubjects { get; set; }
    }
}
