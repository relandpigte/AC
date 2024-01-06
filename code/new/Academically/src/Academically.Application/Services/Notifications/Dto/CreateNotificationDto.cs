using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Notifications.Dto
{
    public class CreateNotificationDto : FullAuditedEntityDto<Guid>
    {
        public long UserId { get; set; }
        public long ActorId { get; set; }
        public NotificationAction Action { get; set; }
        public NotificationTarget Target { get; set; }
        public Guid ReferenceId { get; set; }
        public Guid SourceId { get; set; }
        public string Url { get; set; }
        public string AdditionalData { get; set; }
    }
}
