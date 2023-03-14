using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("RescheduleComments")]
    public class RescheduleComment : CreationAuditedEntity<Guid>
    {
        public DateTime OldStartTime { get; set; }
        public DateTime OldEndTime { get; set; }
        public DateTime NewStartTime { get; set; }
        public DateTime NewEndTime { get; set; }
        public string Comments { get; set; }
        public Guid CalendarEventId { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("CalendarEventId")]
        public virtual CalendarEvent CalendarEvent { get; set; }
    }
}
