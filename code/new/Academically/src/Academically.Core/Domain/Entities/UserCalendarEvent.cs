using Abp.Domain.Entities;
using Academically.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserCalendarEvents")]
    public class UserCalendarEvent : Entity<Guid>
    {
        public long UserId { get; set; }
        public Guid CalendarEventId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        [ForeignKey("CalendarEventId")]
        public virtual CalendarEvent CalendarEvent { get; set; }
    }
}
