using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;
using Academically.Users.Dto;
using System;

namespace Academically.Services.Notifications.Dto
{
    [AutoMap(typeof(NotificationUser))]
    public class NotificationUserDto : FullAuditedEntityDto<Guid>
    {
        public Guid NotificationId { get; set; }
        public long UserId { get; set; }
        public virtual NotificationDto Notification { get; set; }
        public virtual UserDto User { get; set; }
    }
}
