using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ProjectAvailabilities")]
    public class ProjectAvailability : Entity<Guid>
    {
        public Guid ProjectId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public virtual Project Project { get; set; }
    }
}
