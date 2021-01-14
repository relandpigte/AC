using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Entities
{
    [Table("AcademicallyTimeZones")]
    public class TimeZone : Entity<string>
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
    }
}
