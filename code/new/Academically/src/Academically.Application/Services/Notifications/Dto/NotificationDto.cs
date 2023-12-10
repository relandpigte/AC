using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Services.Notifications.Dto
{
    [AutoMap(typeof(Notification))]
    public class NotificationDto : FullAuditedEntityDto<Guid>
    {
        public long UserId { get; set; }
        public NotificationAction Action { get; set; }
        public NotificationTarget Target { get; set; }
        public Guid ReferenceId { get; set; }
        public DateTime? ReadTime { get; set; }
        public string FormattedNotification { get; set; }
        public string Url { get; set; }
        public virtual UserDto User { get; set; }
        public virtual UserDto CreatorUser { get; set; }
        public virtual ICollection<NotificationUserDto> Actors { get; set; }
        public virtual ICollection<NotificationSourceDto> Sources { get; set; }
    }
}
