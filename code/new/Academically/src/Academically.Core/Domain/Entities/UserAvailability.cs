using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("UserAvailabilities")]
    public class UserAvailability : Entity<Guid>
    {
        public DayOfWeek? DayOfWeek { get; set; }
        public bool IsAvailable { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public long UserId { get; set; }
        public DateTime? SpecificDate { get; set; }


        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
