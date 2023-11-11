using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.Notifications.Dto
{
    [AutoMap(typeof(NotificationSource))]
    public class NotificationSourceDto : EntityDto<Guid>
    {
        public Guid NotificationId { get; set; }
        public Guid ReferenceId { get; set; }
        public virtual NotificationDto Notification { get; set; }
    }
}
