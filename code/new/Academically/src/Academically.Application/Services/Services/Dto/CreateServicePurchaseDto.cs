using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;

namespace Academically.Services.Services.Dto
{
    [AutoMap(typeof(ServicePurchase))]
    public class CreateServicePurchaseDto
    {
        public Guid? Id { get; set; }
        public Guid? ReferenceId { get; set; }
        public Guid ServiceOfferId { get; set; }
        public long CreatorUserId { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
