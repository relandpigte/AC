using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.PassportVerifications.Dto
{
    [AutoMapFrom(typeof(PassportVerification))]
    public class PassportVerificationDto : EntityDto<Guid?>
    {
        public PassportVerificationStatus Status { get; set; }
        public Guid DocumentId { get; set; }
        public Guid CreatorUserId { get; set; }
        public DateTime CreationTime { get; set; }
        public Guid? ReviewerUserId { get; set; }
        public DateTime? ReviewTime { get; set; }
    }
}
