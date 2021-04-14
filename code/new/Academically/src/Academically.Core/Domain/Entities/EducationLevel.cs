using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyEducationLevels")]
    public class EducationLevel : Entity<Guid>
    {
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int DisplayOrder { get; set; }
    }
}
