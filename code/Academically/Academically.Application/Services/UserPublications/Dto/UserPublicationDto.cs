using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;

namespace Academically.Services.UserPublications.Dto
{
    [AutoMap(typeof(UserPublication))]
    public class UserPublicationDto : EntityDto<Guid>
    {
        [Required]
        public string PublicationCertificate { get; set; }
        [Required]
        public string Publisher { get; set; }
        [Required]
        public string Summary { get; set; }
        public long UserId { get; set; }
    }
}
