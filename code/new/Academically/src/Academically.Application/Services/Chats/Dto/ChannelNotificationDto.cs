using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Users.Dto;

namespace Academically.Services.Chats.Dto
{
    [AutoMapFrom(typeof(ChannelNotification))]
    public class ChannelNotificationDto: CreationAuditedEntity<Guid>
    {
        public Guid ChannelId { get; set; }
    }
}