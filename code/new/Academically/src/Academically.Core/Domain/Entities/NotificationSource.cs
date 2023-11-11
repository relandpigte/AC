using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("NotificationSources")]
    public class NotificationSource : Entity<Guid>
    {
        public Guid NotificationId { get; set; }
        public Guid ReferenceId { get; set; }

        [ForeignKey("NotificationId")]
        public virtual Notification Notification { get; set; }
    }
}




