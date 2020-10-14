using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyUrgencyLevels")]
    public class UrgencyLevel : Entity<int>
    {
        public string Description { get; set; }
    }
}
