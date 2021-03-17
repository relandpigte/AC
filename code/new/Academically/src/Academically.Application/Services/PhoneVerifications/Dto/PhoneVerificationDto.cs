using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.PhoneVerifications.Dto
{
    [AutoMap(typeof(PhoneVerification))]
    public class PhoneVerificationDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public string Recipient { get; set; }
        public DateTime DateSent { get; set; }
    }
}
