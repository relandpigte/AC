using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("Notifications")]
    [Audited]
    public class Notification : FullAuditedEntity<Guid>
    {
        public long UserId { get; set; }
        public NotificationAction Action { get; set; }
        public NotificationTarget Target { get; set; }
        public Guid ReferenceId { get; set; }
        public DateTime? ReadTime { get; set; }
        public string FormattedNotification { get; set; }
        public string Url { get; set; }

        [ForeignKey("UserId")]
		public virtual User User { get; set; }

        public virtual ICollection<NotificationUser> Actors { get; set; }
        public virtual ICollection<NotificationSource> Sources { get; set; }
    }
}




