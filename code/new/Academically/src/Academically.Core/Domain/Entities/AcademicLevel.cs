using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyAcademicLevels")]
    public class AcademicLevel : Entity<Guid>
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
    }
}
