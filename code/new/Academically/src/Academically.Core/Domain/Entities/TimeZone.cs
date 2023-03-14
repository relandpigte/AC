using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("TimeZones")]
    public class TimeZone : Entity<string>
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
    }
}
