using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserPublications.Dto
{
    [AutoMapTo(typeof(UserPublication))]
    public class GetPublicationDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public string PublicationCertificate { get; set; }
        public string Publisher { get; set; }
        public string Summary { get; set; }
    }
}
