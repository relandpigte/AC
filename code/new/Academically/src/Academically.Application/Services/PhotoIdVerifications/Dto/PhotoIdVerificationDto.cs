using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Documents.Dto;
using System;

namespace Academically.Services.PhotoIdVerifications.Dto
{
    [AutoMap(typeof(PhotoIdVerification))]
    public class PhotoIdVerificationDto : EntityDto<Guid>
    {
        public PhotoIdVerificationStatus Status { get; set; }
        public string PhotoIdUrl { get; set; }
        public DocumentDto Document { get; set; }
    }
}
