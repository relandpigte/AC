using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallySupportLevels")]
    public class SupportLevel : Entity<int>
    {
        public int Level { get; set; }
    }
}
