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
    [Table("NotificationUsers")]
    [Audited]
    public class NotificationUser : FullAuditedEntity<Guid>
    {
        public Guid NotificationId { get; set; }
        public long UserId { get; set; }

        [ForeignKey("NotificationId")]
        public virtual Notification Notification { get; set; }

        [ForeignKey("UserId")]
		public virtual User User { get; set; }
    }
}




