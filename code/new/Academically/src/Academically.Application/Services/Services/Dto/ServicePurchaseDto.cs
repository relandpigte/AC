using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto
{
    [AutoMap(typeof(ServicePurchase))]
    public class ServicePurchaseDto : EntityDto<Guid>
    {
        public Guid? ReferenceId { get; set; }
        public Guid? ServiceOfferId { get; set; }
        public long CreatorUserId { get; set; }
        public DateTime CreationTime { get; set; }
        public virtual UserDto CreatorUser { get; set; }
        public long? OwnerId { get; set; }
        public ServicesType? Type { get; set; }
    }
}
