using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyCalendarEvents")]
    public class CalendarEvent : CreationAuditedEntity<Guid>
    {
        public CalendarEvent()
        {
            RescheduleComments = new HashSet<RescheduleComment>();
            UserCalendarEvents = new HashSet<UserCalendarEvent>();
            Sessions = new HashSet<Session>();
        }

        public string Title { get; set; }
        public CalendarEventType Type { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public CalendarEventRecurrence Recurrence { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? ProjectOfferId { get; set; }

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("ProjectOfferId")]
        public virtual ProjectOffer ProjectOffer { get; set; }

        public virtual ICollection<RescheduleComment> RescheduleComments { get; set; }
        public virtual ICollection<UserCalendarEvent> UserCalendarEvents { get; set; }
        public virtual ICollection<Session> Sessions { get; set; }
    }
}
